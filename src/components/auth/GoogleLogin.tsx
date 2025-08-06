import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

interface GoogleLoginComponentProps {
  onSuccess?: (credentialResponse: any) => void;
}

export const GoogleLoginComponent = ({ onSuccess }: GoogleLoginComponentProps) => {
  const handleSuccess = (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    toast.success('¡Inicio de sesión exitoso!');
    
    if (onSuccess) {
      onSuccess(credentialResponse);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
    toast.error('Error al iniciar sesión con Google');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      theme="outline"
      size="large"
      text="continue_with"
      locale="es"
    />
  );
};