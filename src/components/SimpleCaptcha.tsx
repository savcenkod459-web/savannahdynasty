import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const SimpleCaptcha = ({ onVerify }: SimpleCaptchaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaCode, setCaptchaCode] = useState("");
  const [userInput, setUserInput] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput("");
    return code;
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон с градиентом
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "hsl(var(--secondary))");
    gradient.addColorStop(1, "hsl(var(--secondary) / 0.5)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Добавляем шум
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `hsl(var(--primary) / ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    // Рисуем линии помехи
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `hsl(var(--primary) / 0.3)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Рисуем текст
    ctx.font = "bold 40px Arial";
    ctx.textBaseline = "middle";

    for (let i = 0; i < code.length; i++) {
      const x = 30 + i * 40;
      const y = canvas.height / 2;
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Тень для текста
      ctx.shadowColor = "hsl(var(--primary) / 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Градиент для текста
      const textGradient = ctx.createLinearGradient(0, -20, 0, 20);
      textGradient.addColorStop(0, "hsl(var(--primary))");
      textGradient.addColorStop(1, "hsl(var(--foreground))");
      ctx.fillStyle = textGradient;
      
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    const code = generateCaptcha();
    drawCaptcha(code);
  }, []);

  const handleRefresh = () => {
    const code = generateCaptcha();
    drawCaptcha(code);
    onVerify(false);
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
    if (value.length === 6) {
      const isValid = value === captchaCode;
      onVerify(isValid);
    } else {
      onVerify(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <canvas
          ref={canvasRef}
          width={300}
          height={80}
          className="border-2 border-primary/20 rounded-lg bg-secondary/30"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className="shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="captcha-input">Введите код с картинки</Label>
        <Input
          id="captcha-input"
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Введите 6 символов"
          maxLength={6}
          className="text-lg tracking-widest"
        />
      </div>
    </div>
  );
};

export default SimpleCaptcha;
