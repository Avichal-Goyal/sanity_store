"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define the schema
const addressSchema = z.object({
    name: z.string().min(2, "Name is required"),
    line1: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City is required"),
    postcode: z.string().min(6, "Postcode must be 6 digits"),
    country: z.string().min(1, "Country is required"),
});

export type AddressValues = z.infer<typeof addressSchema>;

interface Props {
    onSubmit: (values: AddressValues) => void;
    isLoading: boolean;
}

export function AddressForm({ onSubmit, isLoading }: Props) {
    const form = useForm<AddressValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: { name: "", line1: "", city: "", postcode: "", country: "India" },
    });

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Line 1</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Postcode</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
        </form>
        </Form>
    );
}