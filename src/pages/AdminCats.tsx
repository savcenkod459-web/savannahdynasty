import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Plus, Image as ImageIcon, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Cat = {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  price: number;
  image: string;
  description: string;
  traits: string[];
  additional_images: string[];
  video?: string;
};

const AdminCats = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingCatId, setUploadingCatId] = useState<string | null>(null);
  const [uploadingAdditionalFor, setUploadingAdditionalFor] = useState<string | null>(null);
  const [uploadingVideoFor, setUploadingVideoFor] = useState<string | null>(null);
  const [newCat, setNewCat] = useState({
    name: "",
    breed: "Саванна F1",
    age: "Котёнок",
    gender: "Самец",
    price: 0,
    description: "",
    traits: "",
    image: "",
    additional_images: [] as string[],
    video: "",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch cats
  const { data: cats, isLoading: catsLoading } = useQuery({
    queryKey: ['admin-cats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Cat[];
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, catId }: { file: File; catId?: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('cat-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cat-images')
        .getPublicUrl(filePath);

      return { publicUrl, catId };
    },
    onSuccess: ({ publicUrl, catId }) => {
      if (catId) {
        updateImageMutation.mutate({ catId, imageUrl: publicUrl });
      } else {
        setNewCat(prev => ({ ...prev, image: publicUrl }));
        toast.success("Изображение загружено!");
      }
      setSelectedFile(null);
      setUploadingCatId(null);
    },
    onError: (error) => {
      toast.error("Ошибка загрузки: " + error.message);
      setUploadingCatId(null);
    },
  });

  // Update cat image mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ catId, imageUrl }: { catId: string; imageUrl: string }) => {
      const { error } = await supabase
        .from('cats')
        .update({ image: imageUrl })
        .eq('id', catId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
      toast.success("Изображение обновлено!");
    },
  });

  // Add additional image mutation
  const addAdditionalImageMutation = useMutation({
    mutationFn: async ({ catId, imageUrl }: { catId: string; imageUrl: string }) => {
      const { data: cat, error: fetchError } = await supabase
        .from('cats')
        .select('additional_images')
        .eq('id', catId)
        .single();

      if (fetchError) throw fetchError;

      const currentImages = cat.additional_images || [];
      const updatedImages = [...currentImages, imageUrl];

      const { error } = await supabase
        .from('cats')
        .update({ additional_images: updatedImages })
        .eq('id', catId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
      setUploadingAdditionalFor(null);
      toast.success("Дополнительное изображение добавлено!");
    },
    onError: () => {
      setUploadingAdditionalFor(null);
    },
  });

  // Set main image from additional images
  const setMainImageMutation = useMutation({
    mutationFn: async ({ catId, imageUrl }: { catId: string; imageUrl: string }) => {
      const { data: cat, error: fetchError } = await supabase
        .from('cats')
        .select('image, additional_images')
        .eq('id', catId)
        .single();

      if (fetchError) throw fetchError;

      const currentAdditional = cat.additional_images || [];
      const oldMainImage = cat.image;
      
      // Remove the new main image from additional images
      const updatedAdditional = currentAdditional.filter((img: string) => img !== imageUrl);
      
      // Add old main image to additional if it's not the placeholder
      if (oldMainImage && !oldMainImage.includes('/src/assets/')) {
        updatedAdditional.push(oldMainImage);
      }

      const { error } = await supabase
        .from('cats')
        .update({ 
          image: imageUrl,
          additional_images: updatedAdditional 
        })
        .eq('id', catId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
      toast.success("Главное изображение изменено!");
    },
  });

  // Delete additional image mutation
  const deleteAdditionalImageMutation = useMutation({
    mutationFn: async ({ catId, imageUrl }: { catId: string; imageUrl: string }) => {
      const { data: cat, error: fetchError } = await supabase
        .from('cats')
        .select('additional_images')
        .eq('id', catId)
        .single();

      if (fetchError) throw fetchError;

      const updatedImages = (cat.additional_images || []).filter((img: string) => img !== imageUrl);

      const { error } = await supabase
        .from('cats')
        .update({ additional_images: updatedImages })
        .eq('id', catId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
      toast.success("Изображение удалено!");
    },
  });

  // Move image in order
  const moveImageMutation = useMutation({
    mutationFn: async ({ catId, fromIndex, toIndex }: { catId: string; fromIndex: number; toIndex: number }) => {
      const { data: cat, error: fetchError } = await supabase
        .from('cats')
        .select('additional_images')
        .eq('id', catId)
        .single();

      if (fetchError) throw fetchError;

      const images = [...(cat.additional_images || [])];
      const [movedImage] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedImage);

      const { error } = await supabase
        .from('cats')
        .update({ additional_images: images })
        .eq('id', catId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
    },
  });

  // Add new cat mutation
  const addCatMutation = useMutation({
    mutationFn: async () => {
      if (!newCat.name || !newCat.description || newCat.price <= 0) {
        throw new Error("Заполните все обязательные поля");
      }

      const { error } = await supabase
        .from('cats')
        .insert([{
          name: newCat.name,
          breed: newCat.breed,
          age: newCat.age,
          gender: newCat.gender,
          price: newCat.price,
          image: newCat.image || '/src/assets/savannah-f1-1.jpg',
          description: newCat.description,
          traits: newCat.traits.split(',').map(t => t.trim()).filter(t => t),
          additional_images: newCat.additional_images,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
      setNewCat({
        name: "",
        breed: "Саванна F1",
        age: "Котёнок",
        gender: "Самец",
        price: 0,
        description: "",
        traits: "",
        image: "",
        additional_images: [],
        video: "",
      });
      toast.success("Кот добавлен!");
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, catId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (catId) {
        setUploadingCatId(catId);
        uploadImageMutation.mutate({ file, catId });
      }
    }
  };

  const handleUploadForNewCat = () => {
    if (selectedFile) {
      uploadImageMutation.mutate({ file: selectedFile });
    }
  };

  const handleAdditionalImageUpload = async (file: File, catId: string) => {
    setUploadingAdditionalFor(catId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('cat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cat-images')
        .getPublicUrl(fileName);

      addAdditionalImageMutation.mutate({ catId, imageUrl: publicUrl });
    } catch (error: any) {
      toast.error("Ошибка загрузки: " + error.message);
      setUploadingAdditionalFor(null);
    }
  };

  const handleVideoUpload = async (file: File, catId?: string) => {
    if (catId) {
      setUploadingVideoFor(catId);
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('cat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cat-images')
        .getPublicUrl(fileName);

      if (catId) {
        const { error } = await supabase
          .from('cats')
          .update({ video: publicUrl })
          .eq('id', catId);

        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ['admin-cats'] });
        queryClient.invalidateQueries({ queryKey: ['cats'] });
        queryClient.invalidateQueries({ queryKey: ['featured-cats'] });
        toast.success("Видео загружено!");
        setUploadingVideoFor(null);
      } else {
        setNewCat(prev => ({ ...prev, video: publicUrl }));
        toast.success("Видео загружено!");
      }
    } catch (error: any) {
      toast.error("Ошибка загрузки видео: " + error.message);
      setUploadingVideoFor(null);
    }
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
              Админ-панель
            </h1>
            <p className="text-muted-foreground">
              Управляйте всем контентом сайта
            </p>
          </div>

          {/* Admin Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card 
              className="glass-card border-primary/20 cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(217,179,112,0.4)] transition-all"
              onClick={() => navigate("/admin/cats")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Управление котами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Загружайте изображения и управляйте каталогом котов
                </p>
              </CardContent>
            </Card>

            <Card 
              className="glass-card border-primary/20 cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(217,179,112,0.4)] transition-all"
              onClick={() => navigate("/admin/pedigree")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Управление родословной
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Добавляйте и редактируйте информацию о родителях котов
                </p>
              </CardContent>
            </Card>

            <Card 
              className="glass-card border-primary/20 cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(217,179,112,0.4)] transition-all"
              onClick={() => navigate("/admin/images")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Управление изображениями
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Добавляйте изображения для всех страниц сайта
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl text-luxury-gradient mb-2">
              Управление котами
            </h2>
            <p className="text-muted-foreground text-sm">
              Загружайте изображения и управляйте каталогом котов
            </p>
          </div>

          {/* Add New Cat Form */}
          <Card className="mb-12 glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Добавить нового кота
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Имя *</Label>
                  <Input
                    value={newCat.name}
                    onChange={(e) => setNewCat(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Аристократ"
                  />
                </div>
                <div>
                  <Label>Порода</Label>
                  <select
                    className="w-full p-2 rounded-md border bg-background"
                    value={newCat.breed}
                    onChange={(e) => setNewCat(prev => ({ ...prev, breed: e.target.value }))}
                  >
                    <option>Саванна F1</option>
                    <option>Саванна F2</option>
                  </select>
                </div>
                <div>
                  <Label>Возраст</Label>
                  <select
                    className="w-full p-2 rounded-md border bg-background"
                    value={newCat.age}
                    onChange={(e) => setNewCat(prev => ({ ...prev, age: e.target.value }))}
                  >
                    <option>Котёнок</option>
                    <option>Взрослый</option>
                  </select>
                </div>
                <div>
                  <Label>Пол</Label>
                  <select
                    className="w-full p-2 rounded-md border bg-background"
                    value={newCat.gender}
                    onChange={(e) => setNewCat(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option>Самец</option>
                    <option>Самка</option>
                  </select>
                </div>
                <div>
                  <Label>Цена (USD) *</Label>
                  <Input
                    type="number"
                    value={newCat.price || ""}
                    onChange={(e) => setNewCat(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label>Черты (через запятую)</Label>
                  <Input
                    value={newCat.traits}
                    onChange={(e) => setNewCat(prev => ({ ...prev, traits: e.target.value }))}
                    placeholder="Экзотический окрас, Высокий статус"
                  />
                </div>
              </div>
              
              <div>
                <Label>Описание *</Label>
                <Textarea
                  value={newCat.description}
                  onChange={(e) => setNewCat(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Роскошный представитель породы..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="mb-2 block">Изображение</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                    className="cursor-pointer"
                  />
                  {selectedFile && !newCat.image && (
                    <Button
                      onClick={handleUploadForNewCat}
                      disabled={uploadImageMutation.isPending}
                    >
                      {uploadImageMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
                {newCat.image && (
                  <p className="text-xs text-green-600 mt-1">✓ Изображение загружено</p>
                )}
              </div>

              <div>
                <Label className="mb-2 block">Видео</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleVideoUpload(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                </div>
                {newCat.video && (
                  <p className="text-xs text-green-600 mt-1">✓ Видео загружено</p>
                )}
              </div>

              <Button
                onClick={() => addCatMutation.mutate()}
                disabled={addCatMutation.isPending}
                className="w-full"
              >
                {addCatMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Добавление...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить кота
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Cats */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold mb-6">Существующие коты</h2>
            
            {catsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cats?.map((cat) => (
                  <Card key={cat.id} className="glass-card border-primary/20">
                    <CardContent className="p-6">
                      <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
                        {cat.image && cat.image.includes('supabase.co') ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-display font-bold text-xl mb-2">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {cat.breed} • {cat.age} • {cat.gender}
                      </p>
                      <p className="text-lg font-bold text-primary mb-4">
                        ${cat.price.toLocaleString()}
                      </p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`file-${cat.id}`} className="text-xs">
                            Обновить главное изображение
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`file-${cat.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, cat.id)}
                              disabled={uploadingCatId === cat.id}
                              className="cursor-pointer text-xs"
                            />
                            {uploadingCatId === cat.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`video-${cat.id}`} className="text-xs">
                            Загрузить видео
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`video-${cat.id}`}
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleVideoUpload(file, cat.id);
                                }
                              }}
                              disabled={uploadingVideoFor === cat.id}
                              className="cursor-pointer text-xs"
                            />
                            {uploadingVideoFor === cat.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            )}
                          </div>
                          {cat.video && (
                            <p className="text-xs text-green-600 mt-1">✓ Видео загружено</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`additional-${cat.id}`} className="text-xs">
                            Добавить дополнительные фото ({cat.additional_images?.length || 0}/5)
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`additional-${cat.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && (cat.additional_images?.length || 0) < 5) {
                                  handleAdditionalImageUpload(file, cat.id);
                                } else if ((cat.additional_images?.length || 0) >= 5) {
                                  toast.error("Максимум 5 дополнительных фото");
                                }
                              }}
                              disabled={uploadingAdditionalFor === cat.id || (cat.additional_images?.length || 0) >= 5}
                              className="cursor-pointer text-xs"
                            />
                            {uploadingAdditionalFor === cat.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            )}
                          </div>
                        </div>

                        {cat.additional_images && cat.additional_images.length > 0 && (
                          <div>
                            <Label className="text-xs mb-2 block">Дополнительные фото</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {cat.additional_images.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square rounded overflow-hidden border border-primary/20 bg-muted">
                                  <img src={img} alt={`Additional ${idx + 1}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                                    <div className="absolute top-1 left-1 flex gap-1">
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-7 w-7"
                                        disabled={idx === 0}
                                        onClick={() => moveImageMutation.mutate({ 
                                          catId: cat.id, 
                                          fromIndex: idx, 
                                          toIndex: idx - 1 
                                        })}
                                      >
                                        <ChevronUp className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-7 w-7"
                                        disabled={idx === cat.additional_images.length - 1}
                                        onClick={() => moveImageMutation.mutate({ 
                                          catId: cat.id, 
                                          fromIndex: idx, 
                                          toIndex: idx + 1 
                                        })}
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="absolute top-1 right-1 h-7 px-2 text-xs"
                                      onClick={() => setMainImageMutation.mutate({ catId: cat.id, imageUrl: img })}
                                    >
                                      Главное
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="destructive"
                                      className="absolute bottom-1 right-1 h-7 w-7"
                                      onClick={() => {
                                        if (confirm("Удалить это изображение?")) {
                                          deleteAdditionalImageMutation.mutate({ catId: cat.id, imageUrl: img });
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminCats;
