export const StatusBadge = ({ status }) => {
    const map = {
        pending: 'bg-amber-100 text-amber-700',
        accepted: 'bg-blue-100 text-blue-700',
        delivered: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-600',
        cancelled: 'bg-gray-100 text-gray-500',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
            {status}
        </span>
    );
};