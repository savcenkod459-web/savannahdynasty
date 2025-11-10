import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SiteImage = {
  id: string;
  page: string;
  section: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
};

const AdminImages = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const [page, setPage] = useState("home");
  const [section, setSection] = useState("");
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        toast.error("Доступ запрещен. У вас нет прав администратора");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ["admin-site-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_images")
        .select("*")
        .order("page", { ascending: true })
        .order("section", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as SiteImage[];
    },
  });

  const addImageMutation = useMutation({
    mutationFn: async () => {
      if (!page || !section || !imageUrl) {
        throw new Error("Заполните все обязательные поля");
      }

      if (editingId) {
        const { error } = await supabase
          .from("site_images")
          .update({
            page,
            section,
            image_url: imageUrl,
            alt_text: altText || null,
            display_order: displayOrder,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_images").insert([
          {
            page,
            section,
            image_url: imageUrl,
            alt_text: altText || null,
            display_order: displayOrder,
          },
        ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
      queryClient.invalidateQueries({ queryKey: ["site-images"] });
      resetForm();
      toast.success(editingId ? "Изображение обновлено!" : "Изображение добавлено!");
    },
    onError: (error: any) => {
      toast.error("Ошибка: " + error.message);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
      queryClient.invalidateQueries({ queryKey: ["site-images"] });
      toast.success("Изображение удалено!");
    },
  });

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `site-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cat-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("cat-images").getPublicUrl(fileName);

      setImageUrl(publicUrl);
      toast.success("Изображение загружено!");
    } catch (error: any) {
      toast.error("Ошибка загрузки: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setPage("home");
    setSection("");
    setAltText("");
    setDisplayOrder(0);
    setImageUrl("");
    setEditingId(null);
  };

  const editImage = (image: SiteImage) => {
    setPage(image.page);
    setSection(image.section);
    setAltText(image.alt_text || "");
    setDisplayOrder(image.display_order);
    setImageUrl(image.image_url);
    setEditingId(image.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pages = [
    { value: "home", label: "Главная" },
    { value: "about", label: "О кошках" },
    { value: "catalog", label: "Каталог" },
    { value: "breeders", label: "Заводчики" },
    { value: "guide", label: "Инструкция" },
    { value: "payment", label: "Оплата" },
    { value: "warranty", label: "Гарантия" },
    { value: "contact", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow mb-4">
              Управление изображениями сайта
            </h1>
            <p className="text-muted-foreground">
              Добавляйте и редактируйте изображения для всех страниц сайта
            </p>
          </div>

          <Card className="mb-12 glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? "Редактировать изображение" : "Добавить изображение"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Страница *</Label>
                  <Select value={page} onValueChange={setPage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Секция *</Label>
                  <Input
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="Например: hero, features, gallery"
                  />
                </div>

                <div>
                  <Label>Alt текст (для SEO)</Label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Описание изображения"
                  />
                </div>

                <div>
                  <Label>Порядок отображения</Label>
                  <Input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Изображение *</Label>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    disabled={uploading}
                  />

                  {uploading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Загрузка...</span>
                    </div>
                  )}

                  {imageUrl && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full rounded-lg border border-primary/20"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => addImageMutation.mutate()}
                  disabled={addImageMutation.isPending}
                  className="flex-1"
                >
                  {addImageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : editingId ? (
                    <Edit className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Обновить" : "Добавить"}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    Отмена
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle>Существующие изображения</CardTitle>
            </CardHeader>
            <CardContent>
              {imagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !images || images.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Изображений пока нет
                </p>
              ) : (
                <div className="space-y-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="p-4 border border-primary/20 rounded-lg flex gap-4"
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || ""}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <p className="font-bold">
                          {pages.find((p) => p.value === image.page)?.label || image.page}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Секция: {image.section}
                        </p>
                        {image.alt_text && (
                          <p className="text-sm">Alt: {image.alt_text}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Порядок: {image.display_order}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => editImage(image)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteImageMutation.mutate(image.id)}
                          disabled={deleteImageMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminImages;
