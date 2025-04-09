import { useQuery } from "@tanstack/react-query";

const fetchReplices = async ({commentId, slug}) => {
    const response = await fetch(`/api/comment/${commentId}/replies?slug=${slug}`)
    
    if(!response.ok) {
        throw new Error("A resposta de rede não está ok")
    }
    return response.json()
}

export const useFetchReplices = ({commentId, slug}) => {
    return useQuery({
        queryKey: ['replices', commentId],
        queryFn: async () => fetchReplices({commentId, slug}),
        enabled: !!commentId && !!slug
    })
}
