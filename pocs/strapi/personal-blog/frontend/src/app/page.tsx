// src/app/page.tsx
import { fetchStrapi } from '@/lib/strapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import database from '@/lib/database.server';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';


// Server Action nativa para o formulário
async function submitContact(formData: FormData) {
  'use server';
  console.log(`formData`, formData);
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  await database.contactMessage.create({
    data: { name, email, message }
  });
}

export default async function Home() {
  // Busca dados dinâmicos do CMS
  const landingData = await fetchStrapi('landing-page?populate=*');
  const postsData = await fetchStrapi('blog-posts?populate=*');
  
  // const pageInfo = landingData.data.attributes;
  const pageInfo = landingData.data;
  
  const posts = postsData.data;
  console.log(`pageInfo.HeroDescription`, pageInfo.HeroDescription);

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-16">
      {/* Hero Section vinda do Strapi */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">{pageInfo.Title || "Vinicius Feitosa da Silva"}</h1>
        

        <div className="markdown-content">
            <BlocksRenderer content={pageInfo.HeroDescription} />
      </div>
        {/* <div className="text-xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageInfo.HeroDescription }} /> */}
        {/* {pageInfo.HeroDescription.map((hero: any, index:number) => (
            <div key={`${index}-hero`} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
              <p className="font-semibold">{hero.children}</p>
            </div>
          ))} */}
        {/* <div className="text-xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageInfo.HeroDescription }} /> */}
      </section>

      {/* Blog Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Últimos Artigos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold">{post.Title}</h3>
              <p className="text-sm text-zinc-500 mt-2">Leia mais em /blog/{post.Slug}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de Contato usando Prisma v7 e Server Actions */}
      <section className="bg-zinc-50 p-8 rounded-2xl dark:bg-zinc-900">
        <h2 className="text-2xl font-bold mb-4">Entre em contato</h2>
        <form action={submitContact} className="space-y-4 max-w-md">
          <Input name="name" placeholder="Seu Nome" required />
          <Input name="email" type="email" placeholder="Seu E-mail" required />
          <Textarea name="message" placeholder="Como posso ajudar?" required />
          <Button type="submit" className="w-full">Enviar Mensagem</Button>
        </form>
      </section>
    </main>
  );
}