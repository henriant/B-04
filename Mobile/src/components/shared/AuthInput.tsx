// samle felles props fror inputfelt

import { type LucideIcon } from "lucide-react-native";
import { View, Text, TextInput, StyleSheet, type TextInputProps } from "react-native";
import colors from "@/theme";

type AuthInputProps = TextInputProps & {
    icon: LucideIcon
    error?: string
}

export function AuthInput({ icon: Icon, error, ...rest }: AuthInputProps) {
    return (
        <>
            <View style={styles.inputContainer}>
                <Icon style={styles.inputIcon} />
                <TextInput style={styles.inputText}
                    placeholderTextColor='#fcfcfc58'
                    {...rest}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        width: '80%',
        marginBottom: 10,
        backgroundColor: colors.navyBlue,
    },
    inputText: {
        color: colors.white,
        flex: 1,
    },
    inputIcon: {
        marginRight: 15,
        color: colors.white,
    },
    errorText: {
        width: '80%',
        marginBottom: 10,
        color: colors.errorColor,
    },
})