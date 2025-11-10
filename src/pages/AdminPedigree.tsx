import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Plus, Trash2, X, Edit, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

      if (editingId) {
        const { error } = await supabase
          .from("cat_pedigrees")
          .update({
            cat_id: selectedCat,
            parent_type: parentType,
            parent_name: parentName,
            parent_breed: parentBreed,
            parent_description: parentDescription || null,
            parent_images: parentImages,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pedigrees"] });
      resetForm();
      toast.success(editingId ? "Родословная обновлена!" : "Родословная добавлена!");
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

  const resetForm = () => {
    setSelectedCat("");
    setParentName("");
    setParentBreed("");
    setParentDescription("");
    setParentImages([]);
    setEditingId(null);
  };

  const editPedigree = (pedigree: PedigreeEntry) => {
    setSelectedCat(pedigree.cat_id);
    setParentType(pedigree.parent_type);
    setParentName(pedigree.parent_name);
    setParentBreed(pedigree.parent_breed);
    setParentDescription(pedigree.parent_description || "");
    setParentImages(pedigree.parent_images || []);
    setEditingId(pedigree.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openGallery = (images: string[], index: number = 0) => {
    setGalleryImages(images);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
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
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? "Редактировать родителя" : "Добавить родителя"}
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
                            className="w-full aspect-square object-cover rounded-lg cursor-pointer"
                            onClick={() => openGallery(parentImages, idx)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              openGallery(parentImages, idx);
                            }}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => addPedigreeMutation.mutate()}
                  disabled={addPedigreeMutation.isPending}
                  className="flex-1"
                >
                  {addPedigreeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : editingId ? (
                    <Edit className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Обновить" : "Добавить родителя"}
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
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => editPedigree(pedigree)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deletePedigreeMutation.mutate(pedigree.id)}
                              disabled={deletePedigreeMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {pedigree.parent_images && pedigree.parent_images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                            {pedigree.parent_images.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={img}
                                  alt={`${pedigree.parent_name} ${idx + 1}`}
                                  className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => openGallery(pedigree.parent_images, idx)}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openGallery(pedigree.parent_images, idx);
                                  }}
                                >
                                  <Maximize2 className="w-3 h-3" />
                                </Button>
                              </div>
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

      {/* Fullscreen Gallery */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
              onClick={prevImage}
            >
              <X className="w-4 h-4 rotate-90" />
            </Button>
            
            <img
              src={galleryImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
              onClick={nextImage}
            >
              <X className="w-4 h-4 -rotate-90" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPedigree;
