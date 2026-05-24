import ListItem from "@/shared/components/ui/ListItem";
import Badge from "@/shared/components/ui/Badge";

export default function SubmissionItem({ id, time, status }) {
  // Mapeamento exato com o que você tem no front
  const getVariant = (s) => {
    switch (s) {
      case "Approved":
        return "success"; // Ficará verde
      case "Rejected":
        return "danger";  // Ficará vermelho
      case "Pending":
        return "warning"; // Ficará laranja
      default:
        return "neutral"; // Ficará cinza
    }
  };

  return (
    <ListItem>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
          Fiscal Document #{id}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Uploaded {time}
        </p>
      </div>

      <Badge variant={getVariant(status)}>
        {status}
      </Badge>
    </ListItem>
  );
}