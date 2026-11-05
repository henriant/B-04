import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/theme";
import { CircleQuestionMark, Settings } from "lucide-react-native";
import MenuRow from "@/components/shared/MenuRow";
import Button from "@/components/shared/Button";
import { authClient } from "@/auth-client";
import { useState } from "react";
import { router } from "expo-router";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import LoginPrompt from "@/components/shared/LoginPrompt";

const Profile = () => {

    const { data: session, isPending } = authClient.useSession()

    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [requestError, setRequestError] = useState<string | null>(null)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleLogOut = async () => {
        setRequestError(null)
        setIsLoggingOut(true)
        try {
            const { error } = await authClient.signOut()
            if (error) {
                setRequestError(error.message ?? 'Could not log out. Please try again.')
                return
            }
            router.replace('/')
        } catch (cause: unknown) {
            console.error('Log-out failed:', cause)
            setRequestError('Could not log out. Please try again.')
        } finally {
            setIsLoggingOut(false)
        }
    }

    const handleDeleteAccount = async () => {
        setRequestError(null)
        setIsDeleting(true)
        try {
            const { error } = await authClient.deleteUser()
            setIsConfirmingDelete(false)
            if (error) {
                setRequestError(
                    error.code === 'SESSION_EXPIRED'
                        ? 'For security, please log in again before deleting your account.'
                        : error.message ?? 'Could not delete your account. Please try again.',
                )
                return
            }
            router.replace('/')
        } catch (cause: unknown) {
            console.error('Account deletion failed:', cause)
            setIsConfirmingDelete(false)
            setRequestError('Could not delete your account. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    if (!isPending && !session) {
        return <LoginPrompt title="Profile" message="Log in to view your profile." />;
    }

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.name}>{session?.user.name}</Text>
            <Text style={styles.email}>{session?.user.email}</Text>

            <View style={styles.card}>
                <MenuRow icon={Settings} label="Settings" />
                <View style={styles.divider} />
                <MenuRow icon={CircleQuestionMark} label="Help & support" />
            </View>

            <View style={styles.actionButtons}>
                <Button
                    label="Delete account"
                    variant="outlined"
                    onPress={() => setIsConfirmingDelete(true)}
                />
                <Button
                    label={isLoggingOut ? 'Logging out...' : 'Log out'}
                    variant="filled"
                    onPress={() => void handleLogOut()}
                    disabled={isLoggingOut}
                />
            </View>
            {requestError ? <Text accessibilityRole="alert" style={styles.error}>{requestError}</Text> : null}
            <ConfirmDialog
                visible={isConfirmingDelete}
                title="Delete account?"
                message="This will permanently delete your account and cannot be undone."
                confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
                onConfirm={() => void handleDeleteAccount()}
                onCancel={() => setIsConfirmingDelete(false)}
                isBusy={isDeleting}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingHorizontal: 16,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        backgroundColor: colors.navyBlue,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    divider: {
        backgroundColor: colors.muted,
        height: StyleSheet.hairlineWidth,
    },
    actionButtons: {
        marginTop: 24,
        gap: 15,
    },
    name: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '600',
    },
    email: {
        color: colors.muted,
        marginBottom: 16,
    },
    error: {
        color: colors.errorColor,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Profile;