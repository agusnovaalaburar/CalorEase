// src/components/AddFoodModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeFood } from "@/services/iaService";
import {
  createComidaUsuario,
  getComidasPorFecha,
} from "@/services/foodService";
import { getDietas, getComidasDietaByDieta } from "@/services/dietService";
import { useAuth } from "@/hooks/useAuth";
import type { ComidaUsuario, ComidaDieta, Dieta } from "@/types";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (comida: ComidaUsuario) => void;
}

export const AddFoodModal = ({ isOpen, onClose, onSaved }: AddFoodModalProps) => {
  const { usuario } = useAuth();
  const { toast } = useToast();

  // Formulario
  const [text, setText] = useState("");
  const [fechaLocal, setFechaLocal] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [opcion, setOpcion] = useState<string | undefined>("porcion");

  // Resultado IA / preview
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<{
    descripcion: string;
    calorias?: number | null;
    proteinas?: number | null;
    carbohidratos?: number | null;
    grasas?: number | null;
  } | null>(null);

  // editable fields (inicializados desde preview)
  const [descEdit, setDescEdit] = useState("");
  const [calEdit, setCalEdit] = useState<number | "">("");
  const [protEdit, setProtEdit] = useState<number | "">("");
  const [carbEdit, setCarbEdit] = useState<number | "">("");
  const [grasEdit, setGrasEdit] = useState<number | "">("");

  // asociación con dieta
  const [dietas, setDietas] = useState<Dieta[] | null>(null);
  const [selectedDieta, setSelectedDieta] = useState<number | null>(null);
  const [comidasPlanificadas, setComidasPlanificadas] = useState<ComidaDieta[] | null>(null);
  const [selectedComidaPlanificada, setSelectedComidaPlanificada] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  // Reset modal al cerrar
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setPreview(null);
      setDescEdit("");
      setCalEdit("");
      setProtEdit("");
      setCarbEdit("");
      setGrasEdit("");
      setSelectedDieta(null);
      setComidasPlanificadas(null);
      setSelectedComidaPlanificada(null);
    }
  }, [isOpen]);

  // Cargar dietas al abrir modal
  useEffect(() => {
    if (!isOpen || !usuario) return;

    (async () => {
      try {
        const r = await getDietas(usuario.id);
        if (r.ok && r.data) {
          setDietas(r.data as Dieta[]);
          const activa = (r.data as Dieta[]).find(d => d.estado === "activa");
          if (activa) {
            setSelectedDieta(activa.id);
            const rc = await getComidasDietaByDieta(activa.id);
            if (rc.ok && rc.data) setComidasPlanificadas(rc.data as ComidaDieta[]);
          }
        }
      } catch (err) {
        console.error("Error obteniendo dietas:", err);
      }
    })();
  }, [isOpen, usuario?.id]);

  // Sincronizar campos editables con preview
  useEffect(() => {
    if (preview) {
      setDescEdit(preview.descripcion ?? "");
      setCalEdit(preview.calorias ?? "");
      setProtEdit(preview.proteinas ?? "");
      setCarbEdit(preview.carbohidratos ?? "");
      setGrasEdit(preview.grasas ?? "");
    }
  }, [preview]);

  // Analizar comida con IA
  const handleAnalyze = async () => {
    const foodText = text.trim();
    if (!foodText) {
      toast({ title: "Error", description: "Escribe una descripción para analizar", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    setPreview(null);

    try {
      const r = await analyzeFood(foodText, usuario ? {
        peso: usuario.peso,
        altura: usuario.altura,
        edad: usuario.edad,
        objetivo: usuario.objetivo,
      } : undefined);

      console.log("▶️ /analyze-food payload enviado:", { food: foodText });
      console.log("▶️ /analyze-food respuesta:", r);

      if (!r.ok) {
        toast({
          title: "Error IA",
          description: r.data?.error || r.error?.message || `Status ${r.status}`,
          variant: "destructive",
        });
        return;
      }

      let data: any = r.data;
      if (typeof data === "string") data = { descripcion: data };

      setPreview({
        descripcion: data.descripcion ?? foodText,
        calorias: Number.isFinite(Number(data.calorias)) ? Number(data.calorias) : null,
        proteinas: Number.isFinite(Number(data.proteinas)) ? Number(data.proteinas) : null,
        carbohidratos: Number.isFinite(Number(data.carbohidratos)) ? Number(data.carbohidratos) : null,
        grasas: Number.isFinite(Number(data.grasas)) ? Number(data.grasas) : null,
      });
    } catch (err) {
      console.error("Error al analizar con IA:", err);
      toast({ title: "Error", description: "Fallo al conectar con el servicio de IA", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDatetimeLocalToSQL = (local: string) => local ? local.replace("T", " ") + ":00" : null;

  // Guardar comida
  const handleSave = async () => {
    if (!usuario) {
      toast({ title: "Error", description: "Debes iniciar sesión para guardar comidas", variant: "destructive" });
      return;
    }

    const payload: Partial<ComidaUsuario> = {
      usuario_id: usuario.id,
      fecha: formatDatetimeLocalToSQL(fechaLocal) || new Date().toISOString().slice(0, 19).replace("T", " "),
      opcion: opcion ?? "porcion",
      descripcion: (descEdit || text).trim(),
      calorias: calEdit === "" ? null : Number(calEdit),
      proteinas: protEdit === "" ? null : Number(protEdit),
      carbohidratos: carbEdit === "" ? null : Number(carbEdit),
      grasas: grasEdit === "" ? null : Number(grasEdit),
    };

    if (selectedComidaPlanificada) payload.comida_dieta_id = selectedComidaPlanificada;

    if (!payload.descripcion) {
      toast({ title: "Error", description: "Descripción inválida", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const r = await createComidaUsuario(payload);
      if (!r.ok) {
        const errMsg =
          r.data?.message ||
          (r.data && (r.data as any).errors ? Object.values((r.data as any).errors).flat().join(", ") : null) ||
          r.error ||
          `Status ${r.status}`;
        toast({ title: "Error al guardar", description: String(errMsg), variant: "destructive" });
        return;
      }

      toast({ title: "Comida guardada", description: "Se registró la comida correctamente" });
      if (onSaved && r.data) onSaved(r.data as ComidaUsuario);
      setText("");
      setPreview(null);
      onClose();
    } catch (err) {
      console.error("Exception guardando comida:", err);
      toast({ title: "Error", description: "No se pudo guardar la comida", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Agregar comida</DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label>Descripción (texto libre)</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ej: 1 taza de arroz con 120g de pollo y verduras"
                className="h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fecha y hora</Label>
                <Input
                  type="datetime-local"
                  value={fechaLocal}
                  onChange={(e) => setFechaLocal(e.target.value)}
                />
              </div>

              <div>
                <Label>Opción</Label>
                <select
                  value={opcion}
                  onChange={(e) => setOpcion(e.target.value)}
                  className="w-full h-10 rounded-md border px-3"
                >
                  <option value="porcion">Porción</option>
                  <option value="unidad">Unidad</option>
                  <option value="gramos">Gramos</option>
                </select>
              </div>
            </div>

            {comidasPlanificadas && comidasPlanificadas.length > 0 && (
              <div>
                <Label>Vincular a comida planificada (opcional)</Label>
                <select
                  value={selectedComidaPlanificada ?? ""}
                  onChange={(e) => setSelectedComidaPlanificada(e.target.value ? Number(e.target.value) : null)}
                  className="w-full h-10 rounded-md border px-3"
                >
                  <option value="">-- Ninguna --</option>
                  {comidasPlanificadas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fecha} • {c.tipo} • {c.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? <><Loader2 className="animate-spin mr-2" size={16} /> Analizando...</> : "Analizar con IA"}
              </Button>

              <Button variant="secondary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : "Guardar comida"}
              </Button>

              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            </div>

            {preview && (
              <div className="pt-2">
                <h4 className="font-semibold">Preview (editable)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label>Descripción</Label>
                    <Input value={descEdit} onChange={(e) => setDescEdit(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Calorías</Label>
                      <Input type="number" value={calEdit === "" ? "" : String(calEdit)} onChange={(e) => setCalEdit(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>Proteínas (g)</Label>
                      <Input type="number" value={protEdit === "" ? "" : String(protEdit)} onChange={(e) => setProtEdit(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>Carbohidratos (g)</Label>
                      <Input type="number" value={carbEdit === "" ? "" : String(carbEdit)} onChange={(e) => setCarbEdit(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>Grasas (g)</Label>
                      <Input type="number" value={grasEdit === "" ? "" : String(grasEdit)} onChange={(e) => setGrasEdit(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodModal;