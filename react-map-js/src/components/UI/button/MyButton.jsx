import classes from './MyButton.module.css';

{/* we take value(Create post) by using children from <MyButton>Create post</MyButton> */ }
const MyButton = ({ children, ...props }) => {

    return (

        <button {...props} className={classes.myBtn}>
            {/* we take value(Create post) from <MyButton>Create post</MyButton> */}
            {children}
        </button>
    )
}

export default MyButton
