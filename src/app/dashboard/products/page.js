import ProductDashboardContainer from "@/containers/ProductDashboardContainer";
import OptionsManager from "@/components/OptionsManager";

export const dynamic = "force-dynamic";

export default function DashboardProductsPage() {
  return (
    <main className="px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg bg-slate-900 px-8 py-8 text-white shadow-xl mb-8">
          <h1 className="text-3xl font-semibold font-sora">Gestión de productos</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Administrá productos, categorías y opciones de customización.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-700">Opciones de customización</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <OptionsManager
              title="Notas de salida"
              apiUrl="/api/notes?type=salida"
              postUrl="/api/notes"
              fields={[{ name: "name", placeholder: "Nombre de la nota" }]}
              defaultValues={{ type: "salida" }}
            />
            <OptionsManager
              title="Notas de corazon"
              apiUrl="/api/notes?type=corazon"
              postUrl="/api/notes"
              fields={[{ name: "name", placeholder: "Nombre de la nota" }]}
              defaultValues={{ type: "corazon" }}
            />
            <OptionsManager
              title="Notas de base"
              apiUrl="/api/notes?type=base"
              postUrl="/api/notes"
              fields={[{ name: "name", placeholder: "Nombre de la nota" }]}
              defaultValues={{ type: "base" }}
            />
            <OptionsManager
              title="Concentraciones"
              apiUrl="/api/concentrations"
              fields={[{ name: "name", placeholder: "Ej: EDT, EDP, Parfum" }]}
            />
            <OptionsManager
              title="Volumenes"
              apiUrl="/api/volumes"
              fields={[
                { name: "name", placeholder: "Ej: 30ml" },
                { name: "price", placeholder: "Precio", type: "number" },
              ]}
            />
            <OptionsManager
              title="Disenos de frasco"
              apiUrl="/api/bottle-designs"
              fields={[{ name: "name", placeholder: "Ej: Clasico, Premium" }]}
            />
            <OptionsManager
              title="Embalajes"
              apiUrl="/api/packagings"
              fields={[{ name: "name", placeholder: "Ej: Estandar, Gift Box" }]}
            />
          </div>
        </section>

        <section>
          <ProductDashboardContainer />
        </section>
      </div>
    </main>
  );
}
