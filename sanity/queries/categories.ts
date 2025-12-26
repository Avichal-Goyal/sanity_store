import { defineQuery } from "next-sanity";


/**
 * to get all the categories
 * used for navigation and filters
 */

export const ALL_CATEGORIES_QUERY = defineQuery(`*[
    _type == "category"
    ] | order(title asc) {
        _id,
        title,
        "slug" : slug.current,
        "image": image{
            asset -> {
            _id,
            url
        },
        hotspot
        }
    }`);

    /**
     * to get category by Slug
     */

    export const CATEGORY_BY_SLUG_QUERY = defineQuery(`*[
        _type == category
        && slug.current == $slug
        ][0] {
            _id,
            title,
            "slug": slug.current,
            "image": image{
                asset->{
                    _id,
                    url
                },
                hotspot
            }
        }`);