"use server"
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { ProductSchema, updateProductSchema } from "../validators";
import { revalidatePath } from "next/cache";
export async function getSingleProduct(id:string) {
    return await prisma.product.findFirst({
        where: { id: id },
      });
}

export function formatError(error: any) {
    if (error.name === 'ZodError') {
      // Handle Zod error
      const fieldErrors = Object.keys(error.errors).map(
        (field) => error.errors[field].message
      );
  
      return fieldErrors.join('. ');
    } else if (
      error.name === 'PrismaClientKnownRequestError' &&
      error.code === 'P2002'
    ) {
      // Handle Prisma error
      const field = error.meta?.target ? error.meta.target[0] : 'Field';
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else {
      // Handle other errors
      return typeof error.message === 'string'
        ? error.message
        : JSON.stringify(error.message);
    }
  }


export async function createProduct(data: z.infer<typeof ProductSchema>) {
    console.log("Received data before validation:", data);
    try {
      const product = ProductSchema.parse(data);
      console.log("Parsed product:", product);
      
      const productWithCategory = { ...product, category: data.category }; 
      
      await prisma.product.create({ data: productWithCategory });
  
      revalidatePath('/admin');
  
      return { success: true, message: 'Product created successfully' };
    } catch (error) {
      console.error("Error in createProduct:", error);
      return { success: false, message: formatError(error) };
    }
  }


  export async function deleteProduct(id:string) {
    try {
      const productExist = await prisma.product.findFirst({
        where:{id}
      })
    
      if(!productExist) throw new Error('not found')
    
        await prisma.product.delete({
          where:{id}
        })
    
      revalidatePath('/admin/products')
      return {
        success: true,
        message: 'deleted',
      };
    } catch (error) {
      return {
        success: false,
        message: formatError(error),
      };
    }
    }

    
    export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
        try {
          const product = updateProductSchema.parse(data);
          const productExists = await prisma.product.findFirst({
            where: { id: product.id },
          });
      
          if (!productExists) throw new Error('Product not found');
      
          await prisma.product.update({
            where: { id: product.id },
            data: product,
          });
      
          revalidatePath('/admin/products');
      
          return {
            success: true,
            message: 'Product updated successfully',
          };
        } catch (error) {
          return { success: false, message: formatError(error) };
        }
      }
      