import styles from "./Checkbox.module.css"

const Checkbox = ({label, name}) =>{

    return(
        <div className={styles.checkbox_wrapper}>
            <input type="checkbox" id={name} name={name}  />
            <label htmlFor={name} className={styles.checkbox_label}>{label}</label>
        </div>
    )
}

export default Checkbox;