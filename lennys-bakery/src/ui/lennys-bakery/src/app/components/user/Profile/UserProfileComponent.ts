import { Component, OnInit } from "@angular/core";
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
import { ReactiveFormsModule } from "@angular/forms";
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
import { ProgressBar } from "primeng/progressbar";
import { MessageService } from "primeng/api";
import { FileUploadService } from "../../../services/FileUploadService";

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
        ProgressBar,
    ],
})
export class UserProfileComponent implements OnInit {
    accountProfile$: Subject<IAccountProfile>;
    fileName: string;
    uploadProgress: number;
    uploadSub: Subscription;

    constructor(
        private accountService: AccountService,
        private http: HttpClient,
        private messageService: MessageService,
        private fileUploadService: FileUploadService,
    ) {}

    ngOnInit(): void {
        this.accountProfile$ = this.getAccountProfile();
    }

    getAccountProfile(): Subject<IAccountProfile> {
        return this.accountService.getProfile(2);
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        let errorOccurred = false;
        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);
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
        this.uploadSub = null;
    }

    uploadAvatar() {}
}
