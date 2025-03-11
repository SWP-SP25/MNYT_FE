'use client';
import { useAuth } from "@/hooks/useAuth";
import styles from "./auth-homepage.module.css";
import AppSlider from "../../components/slider/app-slider";

const AuthenticatedHomePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    console.log(user);
    return (
        <div className={styles.authContainer}>
            {/* <h1>Chào mừng {user.message} đã quay trở lại!</h1> */}
            <h1>Chào mừng bạn đã quay trở lại!</h1>
            <AppSlider />
        </div>
    );
};

export default AuthenticatedHomePage;