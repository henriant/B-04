import { type LucideIcon, ChevronRight } from "lucide-react-native";
import { Text, Pressable, StyleSheet  } from "react-native";
import colors from "@/theme";


type MenuRowProps = {
    icon: LucideIcon
    label: string
    onPress?: () => void //den er optional, siden funksjonaliteten ikke er/blir implementert nå
}

const MenuRow = ({ icon: Icon, label, onPress }: MenuRowProps) => {
    return (
        <Pressable onPress={onPress} style={styles.row}>
            <Icon color={colors.white} />
            <Text style={styles.label}>{label}</Text>
            <ChevronRight color={colors.muted} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    label: {
        flex: 1,
        marginLeft: 10,
        color: colors.white,
    },
});

export default MenuRow;