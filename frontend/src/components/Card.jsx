export default function Card({ title, description, children, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}