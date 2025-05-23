import { useQuery } from "@tanstack/react-query";

export const fetchReplices = async ({commentId, slug}) => {
    const response = await fetch(`/api/comment/${commentId}/replies?slug=${slug}`)
    
    if(!response.ok) {
        throw new Error("A resposta de rede não está ok")
    }
    return response.json()
}

export const useFetchReplices = ({commentId, slug}) => {
    return useQuery({
        queryKey: ['replies', commentId, slug],
        queryFn: async () => fetchReplices({commentId, slug}),
        enabled: !!commentId && !!slug,
        retry: 5,
        //retryDelay: 100,
    })
}
