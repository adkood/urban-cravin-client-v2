import { redirect } from "next/navigation";

export default function CollectionTagRedirect() {
  redirect("/collection?tag=dhh");
}