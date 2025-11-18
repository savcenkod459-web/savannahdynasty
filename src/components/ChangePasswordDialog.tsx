import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ChangePasswordDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  
  // Инициализация валидации при открытии диалога
  useEffect(() => {
    if (!open) return;

    const validateField = (input: HTMLInputElement | HTMLTextAreaElement): boolean => {
      let errorMessage = '';

      if (input.validity.valueMissing) {
        errorMessage = t('auth.validation.required');
      } else if (input.validity.tooShort) {
        const minLength = input.getAttribute('minlength') || '8';
        const currentLength = input.value.length;
        errorMessage = t('auth.validation.minLength', { 
          min: minLength, 
          current: currentLength.toString() 
        });
      }

      input.setCustomValidity(errorMessage);
      return input.validity.valid;
    };

    const handleInvalid = (e: Event) => {
      e.preventDefault();
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      validateField(input);
      
      const errorSpan = input.parentElement?.querySelector('.validation-error');
      if (errorSpan) {
        errorSpan.textContent = input.validationMessage;
      } else {
        const span = document.createElement('span');
        span.className = 'validation-error text-sm text-destructive mt-1 block';
        span.textContent = input.validationMessage;
        input.parentElement?.appendChild(span);
      }
    };

    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      input.setCustomValidity('');
      
      const errorSpan = input.parentElement?.querySelector('.validation-error');
      if (errorSpan) {
        errorSpan.remove();
      }
      
      if (input.value.length > 0) {
        validateField(input);
      }
    };

    const form = document.querySelector('#change-password-form') as HTMLFormElement;
    if (!form) return;

    const inputs = form.querySelectorAll<HTMLInputElement>(
      'input[required], input[minlength]'
    );
    
    inputs.forEach((input) => {
      input.addEventListener('invalid', handleInvalid);
      input.addEventListener('input', handleInput);
      input.addEventListener('blur', () => {
        if (input.value.length > 0) {
          validateField(input);
        }
      });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('invalid', handleInvalid);
        input.removeEventListener('input', handleInput);
      });
    };
  }, [open, t]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация полей перед отправкой
    const form = e.target as HTMLFormElement;
    const currentPasswordInput = form.querySelector('#current-password') as HTMLInputElement;
    const newPasswordInput = form.querySelector('#new-password') as HTMLInputElement;
    const confirmPasswordInput = form.querySelector('#confirm-password') as HTMLInputElement;
    
    if (!currentPasswordInput?.validity.valid || !newPasswordInput?.validity.valid || !confirmPasswordInput?.validity.valid) {
      return;
    }
    
    // Проверяем что новые пароли совпадают
    if (newPassword !== confirmPassword) {
      toast({
        title: t("changePassword.errors.title"),
        description: t("changePassword.errors.mismatch"),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error(t("changePassword.errors.userNotFound"));
      }

      // Проверяем текущий пароль, пытаясь авторизоваться
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        toast({
          title: t("changePassword.errors.title"),
          description: t("changePassword.errors.wrongPassword"),
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Если текущий пароль верен, меняем на новый
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: t("changePassword.success.title"),
        description: t("changePassword.success.description")
      });

      // Очищаем форму и закрываем диалог
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: t("changePassword.errors.title"),
        description: error.message || t("changePassword.errors.generic"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <KeyRound className="w-4 h-4 mr-2" />
          {t("changePassword.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("changePassword.title")}</DialogTitle>
          <DialogDescription>
            {t("changePassword.description")}
          </DialogDescription>
        </DialogHeader>
        <form id="change-password-form" onSubmit={handleChangePassword} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("changePassword.currentPassword")}</Label>
            <PasswordInput
              id="current-password"
              placeholder={t("changePassword.currentPasswordPlaceholder")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t("changePassword.newPassword")}</Label>
            <PasswordInput
              id="new-password"
              placeholder={t("changePassword.newPasswordPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("changePassword.confirmPassword")}</Label>
            <PasswordInput
              id="confirm-password"
              placeholder={t("changePassword.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {t("changePassword.cancel")}
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? t("changePassword.saving") : t("changePassword.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
