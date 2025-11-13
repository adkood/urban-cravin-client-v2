import { redirect } from "next/navigation";

export default function CollectionCategoryRedirect() {
  redirect("/collection?category=OVERSIZED%20TEES");
}