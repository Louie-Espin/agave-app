/*
 * This unused Proposal interface was created for the Proposal Schema in 'utils/yup.ts'
 * Might need it for debugging/refactoring, TODO delete later
 *
 */
export interface Proposal {
    division: "enhancement" | "tree" | "irrigation";
    requester: {
        name: string;
        email?: string;
        phone?: string;
    };
    client: {
        name: string;
        email?: string;
        phone?: string;
        address?: string;
    };
    property: {
        name: string;
        address: string;
        contact?: string;
        budget?: string;
        gate_code?: string;
    };
    work_requested: {
        amenities?: boolean;
        clean_up?: boolean;
        drywells?: boolean;
        erosion_repair?: boolean;
        fire_wise_clearing?: boolean;
        grading?: boolean;
        granite_install?: boolean;
        hardscape?: boolean;
        irrigation_repair?: boolean;
        irrigation_retrofit?: boolean;
        other?: boolean;
        shrub_planting?: boolean;
        storm_damage?: boolean;
        tree_planting?: boolean
        tree_removal?: boolean;
        tree_trim?: boolean;
        trim_plan?: boolean;
        turf_to_granite?: boolean;
    };
    description?: string;
    information?: {
        description?: string;
        image?: string;
        location?: {
            latitude: number;
            longitude: number;
        };
    }[];
}