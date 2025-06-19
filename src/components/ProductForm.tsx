"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/lib/actions/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload  from "@/components/CloudinaryUploader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductSchema } from "@/lib/validators";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

type ProductFormValues = z.infer<typeof ProductSchema>;

export async function formatError(error: any) {
  // ... error formatting logic
}

export default function ProductForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  console.log('dsadsadas');
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      category: "MATTRESS",
      images: [],
      brand: "",
      description: "",
      descriptionEn: "",
      size: "",
      tbilisi: false,
      batumi: false,
      qutaisi: false,
      price: 0,
      popular: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setError(null);
      const res = await createProduct({
        ...data,
        images: data.images.filter((url): url is string => typeof url === "string"),
      });

      if (res.success) {
        form.reset();
        router.push("/");
        router.refresh();
      } else {
        const message = await res.message;
        setError(message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">პროდუქტის დამატება</h1>
        <p className="text-gray-600">შეავსეთ ფორმა პროდუქტის დასამატებლად</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>სახელი</FormLabel>
                <FormControl>
                  <Input placeholder="პროდუქტის სახელი" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* titleEn */}
       
          
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Product name in English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>კატეგორია</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded px-3 py-2">
                    <option value="MATTRESS">MATTRESS</option>
                    <option value="PILLOW">PILLOW</option>
                    <option value="bundle">bundle</option>
                    <option value="QUILT">QUILT</option>
                    <option value="PAD">PAD</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>სურათები</FormLabel>
                <FormControl>
                  <ImageUpload  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ბრენდი</FormLabel>
                <FormControl>
                  <Input placeholder="ბრენდი" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>აღწერა (ქართულად)</FormLabel>
                <FormControl>
                  <Textarea placeholder="აღწერა" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* descriptionEn */}
          <FormField
            control={form.control}
            name="descriptionEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description in English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* size */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ზომა</FormLabel>
                <FormControl>
                  <Input placeholder="ზომა" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* tbilisi */}
          <FormField
            control={form.control}
            name="tbilisi"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    თბილისი
                  </label>
                </FormControl>
              </FormItem>
            )}
          />

          {/* batumi */}
          <FormField
            control={form.control}
            name="batumi"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    ბათუმი
                  </label>
                </FormControl>
              </FormItem>
            )}
          />

          {/* qutaisi */}
          <FormField
            control={form.control}
            name="qutaisi"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    ქუთაისი
                  </label>
                </FormControl>
              </FormItem>
            )}
          />

          {/* price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ფასი</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="ფასი"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* popular */}
          <FormField
            control={form.control}
            name="popular"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    პოპულარული
                  </label>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "იტვირთება..." : "დამატება"}
          </Button>
        </form>
      </Form>
    </>
  );
} 