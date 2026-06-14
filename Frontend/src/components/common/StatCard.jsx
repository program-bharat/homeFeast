export const StatCard = ({ icon: Icon, label, value, sub, color = 'text-[var(--color-primary)]' }) => (
    <div className="bg-white rounded-md p-5 border border-[var(--color-border)]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--color-text-muted)] text-sm font-medium">{label}</span>
            <div className={`w-9 h-9 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center ${color}`}>
                <Icon size={18} />
            </div>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
        {sub && <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>}
    </div>
);