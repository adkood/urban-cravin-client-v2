import { redirect } from "next/navigation";

export default function CollectionCategoryRedirect() {
  redirect("/collection?category=BAGGY%20VESTs");
}