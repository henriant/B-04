import colors from '@/theme';
import { Text, Pressable, StyleSheet } from 'react-native';


type ButtonProps = {
  label: string;
  variant: 'filled' | 'outlined';
  onPress?: () => void;
  disabled?: boolean;
};


const Button = ({ label, variant, onPress, disabled }: ButtonProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[
      styles.button,
      variant === 'filled' ? styles.filled : styles.outlined,
      disabled && { opacity: 0.5 }
    ]}>
      <Text style={variant === 'filled' ? styles.text : styles.textOutlined}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  filled: {
    backgroundColor: colors.wineRed,
    borderColor: colors.wineRed,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: colors.wineRed,
  },
  text: {
    color: colors.white,
    fontWeight: '600'
  },
  textOutlined: {
    color: colors.wineRed,
    fontWeight: '600'
  },
});

export default Button;