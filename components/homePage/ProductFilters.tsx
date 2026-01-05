"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import { Slider } from "@/components/ui/slider";
import { Badge } from "../ui/badge";
import { COLORS, MATERIALS, SORT_OPTIONS } from "@/lib/constants/filters";

interface ProductFiltersProps {
    categories: ALL_CATEGORIES_QUERYResult;
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const curSearch = searchParams.get("q") ?? "";
    const curCategory = searchParams.get("category") ?? "";
    const curMaterial = searchParams.get("material") ?? "";
    const curColor = searchParams.get("color") ?? "";
    const curSort = searchParams.get("sort") ?? "name";
    const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
    const urlMaxPrice = Number(searchParams.get("maxPrice")) ?? 5000;
    const curInStock = searchParams.get("inStock") === "true";

    //Local state for price range
    const [priceRange, setPriceRange] = useState<[number, number]>([urlMinPrice, urlMaxPrice]);

    //Syncing local state when URL changes
    useEffect(() => {
        setPriceRange([urlMinPrice, urlMaxPrice]);
    }, [urlMinPrice, urlMaxPrice]);

    //Cheecking which filter is active or inactive
    const isSearchActive = !!curSearch;
    const isCategoryActive = !!curCategory;
    const isColorActive = !!curColor;
    const isMaterialActive = !!curMaterial;
    const isPriceActive = urlMinPrice > 0 || urlMaxPrice < 5000;
    const isInStockActive = curInStock;

    const hasActiveFilters = isSearchActive || isCategoryActive || isColorActive || isMaterialActive || isPriceActive || isInStockActive;

    //Count active filters
    const activeFilterCount = [
        isSearchActive,
        isCategoryActive,
        isColorActive,
        isMaterialActive,
        isPriceActive,
        isInStockActive,
    ].filter(Boolean).length;

    const updateParams = useCallback(
        (updates: Record<string, string | number | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "" || value === 0) {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            });

            router.push(`?${params.toString()}`, { scroll: false });
        },
        [router, searchParams],
    );

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get("search") as string;
        updateParams({ q : searchQuery || null });
    };

    const handleClearFilters = () => {
        router.push("/", { scroll : false });
    };

    const clearSingleFilter = ( key : string ) => {
        if( key === "price" ) {
            updateParams({ minPrice: null, maxPrice: null});
        } else {
            updateParams({ [key] : null });
        }
    };

    // Helper for filter label with active indicator
    const FilterLabel = ({
        children, isActive, filterKey
    }: {
        children : React.ReactNode;
        isActive: boolean;
        filterKey: string;
    }) => (
        <div className="mb-2 flex items-center justify-between">
            <span className={`block text-sm font-medium ${
                isActive
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-700 dark:text-zinc-300"
            }`}>
                {children}
                {isActive && (
                    <Badge className="ml-2 h-5 bg-amber-500 px-1.5 text-xs text-white hover:bg-amber-500">
                        Active
                    </Badge>
                )}
            </span>
            {isActive && (
                <button
                    type="button"
                    onClick={() => clearSingleFilter(filterKey)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label={`Clear ${filterKey} filter`}
                >
                <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            {/* Clear Filters - Show at top when active */}
            {hasActiveFilters && (
                <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {activeFilterCount}{" "}
                        {activeFilterCount === 1 ? "filter" : "filters"} applied
                    </span>
                </div>
                <Button
                    size="sm"
                    onClick={handleClearFilters}
                    className="w-full bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                </Button>
                </div>
            )}

            {/** Search */}
            <div>
                <FilterLabel isActive={isSearchActive} filterKey="q">
                    Search
                </FilterLabel>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                        name="search"
                        placeholder="Search products..."
                        defaultValue={curSearch}
                        className={`flex-1 ${
                            isSearchActive
                                ? "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400 dark:ring-amber-400"
                                : ""
                        }`}
                    />
                    <Button type="submit" size="sm">
                        Search
                    </Button>
                </form>
            </div>

            {/* Category */}
            <div>
                <FilterLabel isActive={isCategoryActive} filterKey="category">
                    Category
                </FilterLabel>
                <Select
                    value={curCategory || "all"}
                    onValueChange={(value) =>
                        updateParams({ category: value === "all" ? null : value })
                    }
                >
                    <SelectTrigger
                        className={
                            isCategoryActive
                                ? "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400 dark:ring-amber-400"
                                : ""
                        }
                    >
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                        <SelectItem key={category._id} value={category.slug ?? ""}>
                            {category.title}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/** Color */}
            <div>
                <FilterLabel isActive={isColorActive} filterKey="color">
                    Color
                </FilterLabel>
                <Select
                    value={curColor || "all"}
                    onValueChange={(value) => updateParams({ color : value === "all" ? null : value })}
                >
                    <SelectTrigger
                        className={
                        isColorActive
                            ? "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400 dark:ring-amber-400"
                            : ""
                        }
                    >
                        <SelectValue placeholder="All Colors" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Colors</SelectItem>
                        {COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                            {color.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Material */}
            <div>
                <FilterLabel isActive={isMaterialActive} filterKey="material">
                Material
                </FilterLabel>
                <Select
                value={curMaterial || "all"}
                onValueChange={(value) =>
                    updateParams({ material: value === "all" ? null : value })
                }
                >
                <SelectTrigger
                    className={
                    isMaterialActive
                        ? "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400 dark:ring-amber-400"
                        : ""
                    }
                >
                    <SelectValue placeholder="All Materials" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Materials</SelectItem>
                    {MATERIALS.map((material) => (
                    <SelectItem key={material.value} value={material.value}>
                        {material.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/** Price Range */}
            <div>
                <FilterLabel isActive={isPriceActive} filterKey="price">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </FilterLabel>
                <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    onValueCommit={([min, max]) =>
                        updateParams({
                        minPrice: min > 0 ? min : null,
                        maxPrice: max < 5000 ? max : null,
                        })
                    }
                    className={`mt-4 ${isPriceActive ? "[&_[role=slider]]:border-amber-500 [&_[role=slider]]:ring-amber-500" : ""}`}
                />
            </div>
        </div>
    )
}