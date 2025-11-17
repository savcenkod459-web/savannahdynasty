import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем что новые пароли совпадают
    if (newPassword !== confirmPassword) {
      toast({
        title: t("changePassword.errors.title"),
        description: t("changePassword.errors.mismatch"),
        variant: "destructive"
      });
      return;
    }

    // Проверяем минимальную длину
    if (newPassword.length < 8) {
      toast({
        title: t("changePassword.errors.title"),
        description: t("changePassword.errors.tooShort"),
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
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("changePassword.currentPassword")}</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t("changePassword.newPassword")}</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("changePassword.confirmPassword")}</Label>
            <Input
              id="confirm-password"
              type="password"
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
