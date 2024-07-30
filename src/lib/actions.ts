"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateProduct, EditProduct } from "./validations/product";
import { prisma } from "./prisma";
import { Address, ProductStatus } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { CategoryFormState, CreateCategory } from "./validations/category";
import { slugify } from "./utils";
import { AddressState, CreateAddress } from "./validations/address";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type ProductFormState = {
  errors?: {
    name?: string[] | undefined;
    description?: string[] | undefined;
    price?: string[] | undefined;
    stock?: string[] | undefined;
    imageUrl?: string[] | undefined;
    categoryId?: string[] | undefined;
    status?: string[] | undefined;
  };
  message?: string | null;
};

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
) {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string, 10),
    imageUrl: formData.get("imageUrl"),
    featured: formData.get("featured") === "on",
    categoryId: parseInt(formData.get("categoryId") as string, 10),
    status: "ACTIVE",
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Product.",
    };
  }

  let { name, description, price, stock, imageUrl, categoryId, featured } =
    validatedFields.data;
  price *= 100;

  if (imageUrl) {
    const uploadResult = await cloudinary.uploader.upload(imageUrl);
    imageUrl = uploadResult.secure_url;
  }

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        featured,
        slug: slugify(name),
        status: ProductStatus.ACTIVE,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }

  revalidatePath("/admin/products/");
  revalidatePath("/admin/");
  redirect("/admin/products/");
}

export async function editProduct(
  prevState: ProductFormState,
  formData: FormData
) {
  const validatedFields = EditProduct.safeParse({
    id: parseInt(formData.get("id") as string),
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string, 10),
    imageUrl: formData.get("imageUrl"),
    featured: formData.get("featured") === "on",
    categoryId: parseInt(formData.get("categoryId") as string, 10),
    status: "ACTIVE",
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Edit Product.",
    };
  }
  const product = await prisma.product.findFirst({
    where: { id: validatedFields.data.id },
  });

  let { id, name, description, price, stock, imageUrl, categoryId, featured } =
    validatedFields.data;

  price *= 100;

  if (imageUrl && imageUrl != product?.imageUrl) {
    const uploadResult = await cloudinary.uploader.upload(imageUrl);
    imageUrl = uploadResult.secure_url;
  }

  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        slug: slugify(name),
        status: ProductStatus.ACTIVE,
        featured,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Product.",
    };
  }

  revalidatePath("/admin/products/");
  revalidatePath("/admin/");
  redirect("/admin/products/");
}

export async function createCategory(state: CategoryFormState, data: FormData) {
  const validatedFormData = CreateCategory.safeParse({
    name: (data.get("name") as string) ?? "",
    imageUrl: (data.get("image") as string) ?? "",
  });

  if (!validatedFormData.success) {
    return {
      errors: validatedFormData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Category.",
    };
  }

  let { name, imageUrl } = validatedFormData.data;

  if (imageUrl) {
    const uploadResult = await cloudinary.uploader.upload(imageUrl);
    imageUrl = uploadResult.secure_url;
  }

  try {
    await prisma.category.create({
      data: {
        name,
        imageUrl,
      },
    });
  } catch (e) {
    console.log("Error creating category", e);
    return {
      message: "Database Error please try again later.",
    };
  }

  revalidatePath("/admin/products/");
  revalidatePath("/admin/products/create/");
  revalidatePath("/admin/");
  redirect("/admin/products/");
}

export async function addAddress(state: AddressState, data: FormData) {
  const existingAddress = await getAddressFromCookie();
  if (existingAddress) {
    redirect("/checkout/payment/");
  }
  const formData = {
    name: data.get("name"),
    phoneNumber: data.get("phone"),
    email: data.get("email"),
    address: data.get("address"),
    address2: data.get("address2") || "", // Provide a default empty string if not provided
    state: data.get("state"),
    city: data.get("city"),
    pincode: data.get("pincode"),
  };
  const validatedFormData = CreateAddress.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      errors: validatedFormData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Category.",
    };
  }

  const {
    name,
    phoneNumber,
    email,
    address,
    address2,
    state: st,
    city,
    pincode,
  } = validatedFormData.data;

  const session = await getServerSession(authOptions);

  try {
    const addressObj = await prisma.address.create({
      data: {
        name,
        phoneNumber,
        email,
        userId: session?.user.id,
        address,
        address2,
        state: st,
        city,
        pincode,
      },
    });
    // For payment we store the address in the cookies once its done we clear the cookies
    cookies().set("address", JSON.stringify(addressObj), {
      expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 15,
      secure: true,
      sameSite: true,
    });
  } catch (e) {
    console.log(e);
    return { message: "Database error" };
  }

  redirect("/checkout/payment/");
}

export async function getAddressFromCookie() {
  const data = cookies().get("address");
  if (!data) return null;
  try {
    const address: Address = JSON.parse(data.value);
    if (!address.id) return null;
    return address;
  } catch {
    return null;
  }
}
