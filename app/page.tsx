import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export default async function Home() {
  async function submitForm(formData: FormData) {
    "use server";
    // Upload image to blob storage
    const imageFile = formData.get("image") as File;
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
    });
    revalidatePath("/");

    // Add DB entry with image URL and form data
    const receivingWallet = formData.get("wallet") as string;
    const price = formData.get("price") as string;
    const frameInsertionResult =
      await sql`INSERT INTO FRAMES (imageurl, receivingwallet, price) VALUES (${blob.url}, ${receivingWallet}, ${price}) RETURNING *;`;
    console.log(frameInsertionResult.rows[0]);
  }

  return (
    <div className="flex justify-center items-center pt-10">
      <form action={submitForm}>
        <h1 className="text-2xl font-semibold">Create your Frame</h1>
        <h1 className="text-lg font-semibold pt-10">Upload Image</h1>
        <input type="file" id="image" name="image" required />
        <h1>Set Wallet Address</h1>
        <input type="text" id="wallet" name="wallet"></input>
        <h1>Set Product Price in ETH</h1>
        <input type="text" id="price" name="price"></input>
        <br />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}