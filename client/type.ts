interface buttonProps {
    title: String;
    style: String;
    type: String;
    icon: String;
};
interface homeProps {
    title: String;
    paragraph: String;
    logo: String;
}
interface contentProps {
    title: String;
    paragraph: String;
    background: string;
    reverse: boolean;
    titleButtonOne: String;
    titleButtonTwo: String;
}
interface inputSettingProps {
    type: string;
    placeholder: string;
    isActive: boolean;
    text: string;
    setText: (value: string) => void;
}
interface EditUserProps {
    userId: string;
    newDisplayName?: string | null;
    newProfilePicture?: File | null;
}
interface AuthState {
    isAuth: boolean | null;
    isLoading: boolean;
    user: any;
    error?: string;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    editUser: (props: EditUserProps) => Promise<void>;
}
interface User {
    displayName?: string;
    email?: string;
    image?: string;
}