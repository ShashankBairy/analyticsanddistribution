import { useState } from "react";
import { Field } from "formik";
import { ReactComponent as UploadIcon } from "../../../../../../assets/application-status/Upload.svg";

import FormError from "./FormError";
import styles from "./ProfilePhoto.module.css";

const ProfilePhoto = ({ touched, errors, viewOnly = false, isSubmitted }) => {
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  return (
    <div className={styles.profile_photo_form_field}>
      <div className={styles.profile_photo_upload_container}>
        {viewOnly ? (
          // View-only mode
          <div className={styles.profile_photo_upload_circle}>
            {profilePhotoPreview ? (
              <img
                src={profilePhotoPreview}
                alt="Profile Preview"
                className={styles.profile_photo_preview_image}
              />
            ) : (
              <div className={styles.profile_photo_placeholder}>
                <span className={styles.profile_photo_upload_text}>
                  No photo uploaded
                </span>
              </div>
            )}
          </div>
        ) : (
          // Edit mode
          <label htmlFor="profilePhoto-input" className={styles.profile_photo_label}>
            <div className={styles.profile_photo_upload_circle}>
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile Preview"
                  className={styles.profile_photo_preview_image}
                />
              ) : (
                <>
                  <figure className={styles.profile_photo_upload_icon_figure}>
                    <UploadIcon className={styles.profile_photo_upload_svg} />
                  </figure>
                  <span className={styles.profile_photo_upload_text}>
                    Upload image of student
                  </span>
                </>
              )}

              {/* Hover Overlay - Edit Badge */}
              <div className={styles.profile_photo_hover_overlay}>
                <div className={styles.profile_photo_edit_badge}>
                  <span className={styles.profile_photo_edit_icon_wrapper}>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.9165 1.58008H2.37484C1.95491 1.58008 1.55218 1.74689 1.25525 2.04383C0.958319 2.34076 0.791504 2.74349 0.791504 3.16341V14.2467C0.791504 14.6667 0.958319 15.0694 1.25525 15.3663C1.55218 15.6633 1.95491 15.8301 2.37484 15.8301H13.4582C13.8781 15.8301 14.2808 15.6633 14.5778 15.3663C14.8747 15.0694 15.0415 14.6667 15.0415 14.2467V8.70508"
                        stroke="white"
                        strokeWidth="1.58333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.9633 1.28338C13.2782 0.968438 13.7054 0.791504 14.1508 0.791504C14.5962 0.791504 15.0233 0.968438 15.3383 1.28338C15.6532 1.59833 15.8302 2.02548 15.8302 2.47088C15.8302 2.91628 15.6532 3.34344 15.3383 3.65838L8.203 10.7945C8.01502 10.9823 7.78279 11.1198 7.52771 11.1943L5.25325 11.8593C5.18513 11.8791 5.11292 11.8803 5.04418 11.8627C4.97544 11.8451 4.9127 11.8093 4.86252 11.7592C4.81234 11.709 4.77658 11.6462 4.75897 11.5775C4.74136 11.5088 4.74255 11.4365 4.76242 11.3684L5.42742 9.09397C5.50225 8.83909 5.64 8.60714 5.828 8.41947L12.9633 1.28338Z"
                        stroke="white"
                        strokeWidth="1.58333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>Edit</span>
                </div>
              </div>

              {/* Delete Button - Only when photo exists */}
              {profilePhotoPreview && (
                <button
                  type="button"
                  className={styles.profile_photo_delete_button}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent label click
                    const input = document.getElementById("profilePhoto-input");
                    if (input) input.value = "";
                    setProfilePhotoPreview(null);
                  }}
                  aria-label="Remove photo"
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 13.5C1.8375 13.5 1.4845 13.3532 1.191 13.0597C0.897502 12.7662 0.750503 12.413 0.750003 12V2.25C0.537503 2.25 0.359503 2.178 0.216003 2.034C0.0725027 1.89 0.000502586 1.712 2.5862e-06 1.5C-0.000497414 1.288 0.0715027 1.11 0.216003 0.966C0.360503 0.822 0.538503 0.75 0.750003 0.75H3.75C3.75 0.5375 3.822 0.3595 3.966 0.216C4.11 0.0725001 4.288 0.0005 4.5 0H7.5C7.7125 0 7.89075 0.0720001 8.03475 0.216C8.17875 0.36 8.2505 0.538 8.25 0.75H11.25C11.4625 0.75 11.6408 0.822 11.7848 0.966C11.9288 1.11 12.0005 1.288 12 1.5C11.9995 1.712 11.9275 1.89025 11.784 2.03475C11.6405 2.17925 11.4625 2.251 11.25 2.25V12C11.25 12.4125 11.1033 12.7657 10.8098 13.0597C10.5163 13.3537 10.163 13.5005 9.75 13.5H2.25ZM4.5 10.5C4.7125 10.5 4.89075 10.428 5.03475 10.284C5.17875 10.14 5.2505 9.962 5.25 9.75V4.5C5.25 4.2875 5.178 4.1095 5.034 3.966C4.89 3.8225 4.712 3.7505 4.5 3.75C4.288 3.7495 4.11 3.8215 3.966 3.966C3.822 4.1105 3.75 4.2885 3.75 4.5V9.75C3.75 9.9625 3.822 10.1407 3.966 10.2847C4.11 10.4288 4.288 10.5005 4.5 10.5ZM7.5 10.5C7.7125 10.5 7.89075 10.428 8.03475 10.284C8.17875 10.14 8.2505 9.962 8.25 9.75V4.5C8.25 4.2875 8.178 4.1095 8.034 3.966C7.89 3.8225 7.712 3.7505 7.5 3.75C7.288 3.7495 7.11 3.8215 6.966 3.966C6.822 4.1105 6.75 4.2885 6.75 4.5V9.75C6.75 9.9625 6.822 10.1407 6.966 10.2847C7.11 10.4288 7.288 10.5005 7.5 10.5Z"
                      fill="#FF0000"
                    />
                  </svg>
                </button>
              )}
            </div>
          </label>
        )}

        {/* Hidden File Input + Error */}
        {!viewOnly && (
          <>
            <Field name="profilePhoto">
              {({ field, form }) => (
                <input
                  id="profilePhoto-input"
                  name="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    form.setFieldValue("profilePhoto", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setProfilePhotoPreview(e.target.result);
                      reader.readAsDataURL(file);
                    } else {
                      setProfilePhotoPreview(null);
                    }
                  }}
                  style={{ display: "none" }}
                />
              )}
            </Field>

            <FormError
              name="profilePhoto"
              touched={touched}
              errors={errors}
              className={styles.profile_photo_error}
              showOnChange={false}
              isSubmitted={isSubmitted}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;