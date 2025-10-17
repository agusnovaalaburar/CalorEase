// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AddFoodModal from "@/components/AddFoodModal";
import DailyFoodsList from "@/components/DailyFoodsList";
import { useAuth } from "@/hooks/useAuth";
import { useFood } from "@/hooks/useFood";
import { getDietas, getComidasDietaByDieta } from "@/services/dietService";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { usuario } = useAuth();
  const { foodsByDate, refresh, getCached } = useFood();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [comidasPlanificadasHoy, setComidasPlanificadasHoy] = useState<any[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Calcular resumen: calorías totales y cantidad comidas para la fecha seleccionada
  const foodsToday = useMemo(() => getCached(date) ?? [], [getCached, date]);
  const caloriesSum = useMemo(
    () => foodsToday.reduce((s, f) => s + (Number(f.calorias) || 0), 0),
    [foodsToday]
  );

  // Cargar comidas planificadas para la(s) dieta(s) activas en esa fecha
  useEffect(() => {
    if (!usuario) return;
    let mounted = true;
    (async () => {
      setLoadingPlan(true);
      try {
        const r = await getDietas(usuario.id);
        if (!r.ok) {
          console.warn("No se pudieron obtener dietas:", r);
          setLoadingPlan(false);
          return;
        }
        const dietas = r.data ?? [];
        // por simplicidad tomamos dietas con estado 'activa' (puede haber varias)
        const activas = dietas.filter((d: any) => d.estado === "activa");
        const results: any[] = [];
        for (const d of activas) {
          const rc = await getComidasDietaByDieta(d.id);
          if (rc.ok && rc.data) {
            // filtrar por fecha (la fecha de la comida_dieta puede contener fecha exacta)
            const comidasHoy = (rc.data as any[]).filter((c) => c.fecha && c.fecha.startsWith(date));
            results.push(...comidasHoy);
          }
        }
        if (mounted) setComidasPlanificadasHoy(results);
      } catch (err) {
        console.error("Error cargando comidas planificadas:", err);
      } finally {
        if (mounted) setLoadingPlan(false);
      }
    })();

    return () => { mounted = false; };
  }, [usuario, date]);

  const handleRefresh = async () => {
    try {
      await refresh(date);
      toast({ title: "Refrescado", description: "Datos actualizados" });
    } catch (err) {
      console.error("Error al refrescar:", err);
      toast({ title: "Error", description: "No se pudo refrescar", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        {usuario ? (
          <div className="ml-auto mr-4 font-semibold flex items-center gap-4">
            <span>Bienvenido, {usuario.nombre}</span>
            <Button variant="ghost" onClick={() => navigate("/profile")}>Perfil</Button>
          </div>
        ) : null}
      </Navbar>

      <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Fecha</div>
              <div className="text-lg font-semibold">{date}</div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setOpenAdd(true)}><Plus size={14} className="mr-2" />Agregar comida</Button>
                <Button variant="ghost" onClick={handleRefresh}><RefreshCw size={14} className="mr-2" />Refrescar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Calorías consumidas</div>
              <div className="text-2xl font-bold">{caloriesSum} kcal</div>
              <div className="text-sm text-muted-foreground mt-2">Comidas registradas: {foodsToday.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Comidas planificadas hoy</div>
              <div className="text-lg font-semibold">{loadingPlan ? "Cargando..." : comidasPlanificadasHoy.length}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {comidasPlanificadasHoy.slice(0,3).map(c => (
                  <div key={c.id} className="truncate">{c.tipo} — {c.descripcion}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aquí va el componente principal de la lista diaria */}
        <DailyFoodsList />

      </main>

      <Footer />

      <AddFoodModal isOpen={openAdd} onClose={() => setOpenAdd(false)} onSaved={async () => { await refresh(date); setOpenAdd(false); }} />
    </div>
  );
};

export default Dashboard;