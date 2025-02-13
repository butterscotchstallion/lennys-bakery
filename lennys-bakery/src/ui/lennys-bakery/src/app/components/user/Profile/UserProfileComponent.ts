import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { UserProfileMenuComponent } from "./UserProfileMenuComponent";
import { Button } from "primeng/button";
import { Textarea } from "primeng/textarea";
import { AccountService } from "../../../services/AccountService";
import { IAccountProfile } from "../../../models/IAccountProfile";
import { Avatar } from "primeng/avatar";
import { CommonModule, NgIf } from "@angular/common";
import { ProgressSpinner } from "primeng/progressspinner";
import {
    catchError,
    finalize,
    Observable,
    Subject,
    Subscription,
    throwError,
} from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    HttpClient,
    HttpErrorResponse,
    HttpEventType,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent,
} from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUploadService } from "../../../services/FileUploadService";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-user-profile",
    templateUrl: "./UserProfileComponent.html",
    imports: [
        UserProfileMenuComponent,
        Button,
        Textarea,
        Avatar,
        NgIf,
        CommonModule,
        ProgressSpinner,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class UserProfileComponent implements OnInit {
    accountProfile$: Subject<IAccountProfile>;
    accountProfile: IAccountProfile;
    fileName: string;
    uploadProgress: number;
    uploadSub: Subscription;
    isUploading = false;
    private destroyRef: any = inject(DestroyRef);

    constructor(
        private accountService: AccountService,
        private http: HttpClient,
        private messageService: MessageService,
        private fileUploadService: FileUploadService,
    ) {}

    ngOnInit(): void {
        this.getAccountProfile();
    }

    getAccountProfile() {
        this.accountService
            .getProfile(2)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((accountProfile: IAccountProfile) => {
                this.accountProfile = accountProfile;
            });
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        let errorOccurred = false;
        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);
            this.isUploading = true;
            const upload$: Observable<
                | HttpSentEvent
                | HttpHeaderResponse
                | HttpResponse<unknown>
                | HttpProgressEvent
                | HttpUserEvent<unknown>
            > = this.fileUploadService
                .uploadFile("user/profile/avatar", formData)
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        let errorMessage = "An error occurred during upload";

                        if (error.error instanceof ErrorEvent) {
                            errorMessage = `Error: ${error.error.message}`;
                        } else {
                            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        }

                        if (error.status === 400) {
                            errorMessage = "Invalid file type";
                        }

                        if (error.status === 413) {
                            errorMessage = "File size is too large";
                        }

                        this.messageService.add({
                            severity: "error",
                            summary: "Failed to upload avatar",
                            detail: errorMessage,
                        });

                        errorOccurred = true;

                        return throwError(() => error);
                    }),
                    finalize(() => {
                        this.reset();

                        if (!errorOccurred) {
                            this.messageService.add({
                                severity: "success",
                                summary: "Upload Successful",
                                detail: "Avatar Uploaded Successfully",
                            });
                            this.getAccountProfile();
                        }
                    }),
                );

            this.uploadSub = upload$.subscribe((event) => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(
                        100 * (event.loaded / event.total),
                    );
                }
            });
        }
    }

    cancelUpload() {
        this.uploadSub.unsubscribe();
        this.reset();
    }

    reset() {
        this.uploadProgress = null;
        this.isUploading = false;
        this.uploadSub = null;
    }

    saveProfile() {
        this.accountService
            .updateProfile(this.accountProfile)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = "Failed to update profile";

                    if (error.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        errorMessage = `Error: ${error.status} - ${error.message}`;
                    }

                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: errorMessage,
                    });

                    return throwError(() => error);
                }),
            )
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: "success",
                        summary: "Success",
                        detail: "Profile updated successfully",
                    });
                },
            });
    }
}
