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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

interface EmailVerificationDialogProps {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export const EmailVerificationDialog = ({
  email,
  open,
  onOpenChange,
  onVerified
}: EmailVerificationDialogProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const { toast } = useToast();

  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      // Генерируем 6-значный код
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(verificationCode);

      // Отправляем код через edge function
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, code: verificationCode }
      });

      if (error) throw error;

      // Для разработки показываем код в toast
      if (data?.debug_code) {
        toast({
          title: "Код отправлен (DEV MODE)",
          description: `Код подтверждения: ${data.debug_code}`,
          duration: 10000
        });
      } else {
        toast({
          title: "Код отправлен",
          description: "Проверьте вашу почту"
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = () => {
    if (code === sentCode) {
      toast({
        title: "Успешно",
        description: "Email подтвержден"
      });
      onVerified();
      onOpenChange(false);
    } else {
      toast({
        title: "Ошибка",
        description: "Неверный код подтверждения",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Подтверждение email
          </DialogTitle>
          <DialogDescription>
            Введите код подтверждения, отправленный на {email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!sentCode ? (
            <Button
              onClick={sendVerificationCode}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Отправка..." : "Отправить код на почту"}
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="verification-code">Код подтверждения</Label>
                <Input
                  id="verification-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Введите 6-значный код"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={sendVerificationCode}
                  disabled={loading}
                  className="flex-1"
                >
                  Отправить снова
                </Button>
                <Button
                  onClick={verifyCode}
                  disabled={code.length !== 6}
                  className="flex-1"
                >
                  Подтвердить
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
