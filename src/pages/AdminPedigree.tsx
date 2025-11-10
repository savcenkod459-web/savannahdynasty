import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Plus, Trash2, X } from "lucide-react";
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

type Cat = {
  id: string;
  name: string;
  breed: string;
};

type PedigreeEntry = {
  id: string;
  cat_id: string;
  parent_type: string;
  parent_name: string;
  parent_breed: string;
  parent_description: string | null;
  parent_images: string[];
};

const AdminPedigree = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const [selectedCat, setSelectedCat] = useState("");
  const [parentType, setParentType] = useState("father");
  const [parentName, setParentName] = useState("");
  const [parentBreed, setParentBreed] = useState("");
  const [parentDescription, setParentDescription] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [parentImages, setParentImages] = useState<string[]>([]);

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

  const { data: cats } = useQuery({
    queryKey: ["admin-cats-simple"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cats")
        .select("id, name, breed")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Cat[];
    },
  });

  const { data: pedigrees, isLoading: pedigreesLoading } = useQuery({
    queryKey: ["admin-pedigrees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cat_pedigrees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PedigreeEntry[];
    },
  });

  const addPedigreeMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCat || !parentName || !parentBreed) {
        throw new Error("Заполните все обязательные поля");
      }

      const { error } = await supabase.from("cat_pedigrees").insert([
        {
          cat_id: selectedCat,
          parent_type: parentType,
          parent_name: parentName,
          parent_breed: parentBreed,
          parent_description: parentDescription || null,
          parent_images: parentImages,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pedigrees"] });
      setSelectedCat("");
      setParentName("");
      setParentBreed("");
      setParentDescription("");
      setParentImages([]);
      toast.success("Родословная добавлена!");
    },
    onError: (error: any) => {
      toast.error("Ошибка: " + error.message);
    },
  });

  const deletePedigreeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cat_pedigrees")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pedigrees"] });
      toast.success("Родословная удалена!");
    },
    onError: (error: any) => {
      toast.error("Ошибка: " + error.message);
    },
  });

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `pedigree-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("cat-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("cat-images").getPublicUrl(fileName);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setParentImages((prev) => [...prev, ...urls]);
      toast.success("Изображения загружены!");
    } catch (error: any) {
      toast.error("Ошибка загрузки: " + error.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setParentImages((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-display font-black text-luxury-gradient luxury-text-shadow mb-4">
              Управление родословной
            </h1>
            <p className="text-muted-foreground">
              Добавляйте информацию о родителях котов
            </p>
          </div>

          <Card className="mb-12 glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Добавить родителя
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Выберите кота *</Label>
                  <Select value={selectedCat} onValueChange={setSelectedCat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите кота" />
                    </SelectTrigger>
                    <SelectContent>
                      {cats?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({cat.breed})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Тип родителя *</Label>
                  <Select value={parentType} onValueChange={setParentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Отец</SelectItem>
                      <SelectItem value="mother">Мать</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Имя родителя *</Label>
                  <Input
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Например: Аристократ"
                  />
                </div>

                <div>
                  <Label>Порода родителя *</Label>
                  <Input
                    value={parentBreed}
                    onChange={(e) => setParentBreed(e.target.value)}
                    placeholder="Например: Саванна F1"
                  />
                </div>
              </div>

              <div>
                <Label>Описание (необязательно)</Label>
                <Textarea
                  value={parentDescription}
                  onChange={(e) => setParentDescription(e.target.value)}
                  placeholder="Опишите родителя..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Изображения</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      disabled={uploadingImages}
                      className="flex-1"
                    />
                    {uploadingImages && (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    )}
                  </div>

                  {parentImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {parentImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Parent ${idx + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(idx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => addPedigreeMutation.mutate()}
                disabled={addPedigreeMutation.isPending}
                className="w-full"
              >
                {addPedigreeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Добавить родителя
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle>Существующие записи родословной</CardTitle>
            </CardHeader>
            <CardContent>
              {pedigreesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !pedigrees || pedigrees.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Записей пока нет
                </p>
              ) : (
                <div className="space-y-4">
                  {pedigrees.map((pedigree) => {
                    const cat = cats?.find((c) => c.id === pedigree.cat_id);
                    return (
                      <div
                        key={pedigree.id}
                        className="p-4 border border-primary/20 rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-bold">
                              {cat?.name} - {pedigree.parent_type === "father" ? "Отец" : "Мать"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {pedigree.parent_name} ({pedigree.parent_breed})
                            </p>
                            {pedigree.parent_description && (
                              <p className="text-sm">{pedigree.parent_description}</p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deletePedigreeMutation.mutate(pedigree.id)}
                            disabled={deletePedigreeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {pedigree.parent_images && pedigree.parent_images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {pedigree.parent_images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`${pedigree.parent_name} ${idx + 1}`}
                                className="w-full aspect-square object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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

export default AdminPedigree;
