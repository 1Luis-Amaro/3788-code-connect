"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";
import { Spinner } from "@/components/Spinner";
import styles from "./page.module.css";
import Link from "next/link";

const fetchPosts = async ({ page }) => {
  const results = await fetch(`http://localhost:3000/api/posts?page=${page}`);

  const data = await results.json();

  return data;
};

export const fetchPostsRating = async ({ postId }) => {
  const results = await fetch(
    `http://localhost:3000/api/post?postId=${postId}`
  );

  const data = await results.json();

  return data;
};



export default function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;

  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["posts", currentPage], //definir a key, com isso ele genrencia o cash
    queryFn: () => fetchPosts({ page: currentPage }), //lugar que o useQuery vai buscar os dados
    staleTime: 2000, // O dado será considerado "fresco" por 2 segundos. Após isso, ele pode ser refetchado.
    //refetchOnWindowFocus: false, // Desativa a refetch automática ao voltar o foco para a aba do navegador.
    //gcTime: 2000, // O dado será removido do cache após 2 segundos desde que não esteja mais sendo usado
  });

  const postRatingQueries = useQueries({
    queries: posts?.data.length > 0 ? posts.data.map((post) => ({
      queryKey: ["postHome", post.id],
      queryFn: () => fetchPostsRating({postId: post.id}),
      enabled: !!post.id,
    }))
    : [],
  })
 
 // Reduz um array de postRatingQueries para um objeto onde a chave é o ID do post
const ratingsAndCartegoriesMap = postRatingQueries?.reduce((acc, query) => {
  
  // Verifica se a query não está pendente e se contém dados válidos com um ID
  if (!query.isPending && query.data && query.data.id) {

    // Adiciona os dados no acumulador, usando o ID como chave
    // Ex: acc[1] = { id: 1, ... }
    acc[query.data.id] = query.data;
  }

  // Retorna o acumulador para a próxima iteração
  return acc;

// Começa com um objeto vazio como acumulador
}, {});


  return (
    <main className={styles.grid}>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      {posts?.data?.map((post) => (
        <CardPost
          key={post.id}
          post={post}
          rating={ratingsAndCartegoriesMap?.[post.id]?.rating}
          category={ratingsAndCartegoriesMap?.[post.id]?.category}
          isFetching={isFetching}
          currentPage={currentPage}
        />
      ))}
      <div className={styles.links}>
        {posts?.prev && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.prev, q: searchTerm },
            }}
          >
            Página anterior
          </Link>
        )}
        {posts?.next && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.next, q: searchTerm },
            }}
          >
            Próxima página
          </Link>
        )}
      </div>
    </main>
  );
}
