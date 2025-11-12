import styles from "./LoginButton.module.css";
import cn from "classnames";

const LoginButton = ({
  buttonName,
  initialStage,
  loadingStage,
  proceedStage,
  successedStage,
  successMessage,
  onClick,
}) => {
  const displayName = loadingStage ? `${buttonName}ing` : (successedStage ? `${successMessage}`: `${buttonName}`)

  const buttonClass = cn(styles.button, {
    [styles.initial]: initialStage,
    [styles.proceed]: proceedStage,
    [styles.loading]: loadingStage,
    [styles.successed]:successedStage,
    [styles.default]: !initialStage && !proceedStage && !loadingStage,
  });

  return (
    <div className={styles.loginButton_wrapper}>
      <button
        type="submit"
        className={buttonClass}
        onClick={onClick}
        disabled={loadingStage}
      >
        {displayName}
      </button>
    </div>
  );
};

export default LoginButton;
