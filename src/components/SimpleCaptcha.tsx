import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const SimpleCaptcha = ({ onVerify }: SimpleCaptchaProps) => {
  const { t } = useTranslation();
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

  const hslToRgba = (hsl: string, alpha: number = 1): string => {
    // Парсим HSL значение (формат: "0 0% 96%" или "217.2 91.2% 59.8%")
    const parts = hsl.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return `rgba(217, 179, 112, ${alpha})`; // Fallback
    
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
  };

  const getComputedColor = (cssVar: string): string => {
    const style = getComputedStyle(document.documentElement);
    const hslValue = style.getPropertyValue(cssVar).trim();
    
    if (hslValue) {
      return hslToRgba(hslValue, 1);
    }
    
    // Fallback цвета
    return cssVar === '--primary' ? 'rgba(217, 179, 112, 1)' : 'rgba(26, 31, 44, 1)';
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Получаем реальные значения цветов
    const style = getComputedStyle(document.documentElement);
    const primaryHsl = style.getPropertyValue('--primary').trim();
    const secondaryHsl = style.getPropertyValue('--secondary').trim();
    const foregroundHsl = style.getPropertyValue('--foreground').trim();

    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон с градиентом
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, hslToRgba(secondaryHsl, 1));
    gradient.addColorStop(1, hslToRgba(secondaryHsl, 0.5));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Добавляем шум
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = hslToRgba(primaryHsl, Math.random() * 0.3);
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    // Рисуем линии помехи
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = hslToRgba(primaryHsl, 0.3);
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
      ctx.shadowColor = hslToRgba(primaryHsl, 0.5);
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Градиент для текста
      const textGradient = ctx.createLinearGradient(0, -20, 0, 20);
      textGradient.addColorStop(0, hslToRgba(primaryHsl, 1));
      textGradient.addColorStop(1, hslToRgba(foregroundHsl, 1));
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
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-full flex items-center justify-center gap-2">
          <canvas
            ref={canvasRef}
            width={300}
            height={80}
            className="border-2 border-primary/20 rounded-lg bg-secondary/30 w-full max-w-[280px] sm:max-w-[300px]"
            style={{ height: 'auto', aspectRatio: '300/80' }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="shrink-0 h-10 w-10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="captcha-input" className="text-sm">{t("captcha.enterCode")}</Label>
        <Input
          id="captcha-input"
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t("captcha.placeholder")}
          maxLength={6}
          className="text-base sm:text-lg tracking-widest text-center"
        />
      </div>
    </div>
  );
};

export default SimpleCaptcha;
