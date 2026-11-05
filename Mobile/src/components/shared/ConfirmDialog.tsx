import { Modal, StyleSheet, Text, View } from 'react-native'
import colors from '@/theme'
import Button from '@/components/shared/Button'

type ConfirmDialogProps = {
    visible: boolean
    title: string
    message: string
    confirmLabel: string
    onConfirm: () => void
    onCancel: () => void
    isBusy?: boolean
}

const ConfirmDialog = ({ visible, title, message, confirmLabel, onConfirm, onCancel, isBusy }: ConfirmDialogProps) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
        <View style={styles.backdrop}>
            <View style={styles.dialog}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttons}>
                    <View style={styles.buttonSlot}>
                        <Button label="Cancel" variant="outlined" onPress={onCancel} disabled={isBusy} />
                    </View>
                    <View style={styles.buttonSlot}>
                        <Button label={confirmLabel} variant="filled" onPress={onConfirm} disabled={isBusy} />
                    </View>
                </View>
            </View>
        </View>
    </Modal>
)

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        width: '85%',
        maxWidth: 360,
        backgroundColor: colors.navyBlue,
        borderRadius: 14,
        padding: 20,
        gap: 12,
    },
    title: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    message: {
        color: colors.white,
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    buttonSlot: {
        flex: 1,
    },
})

export default ConfirmDialog