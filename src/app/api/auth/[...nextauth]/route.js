import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github'; // Import GitHubProvider

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],

  callbacks:{
    async session({session,token}) {
        session.user.username = session.user.name.split(' ').join('').toLowerCase();
        session.user.uid =  token.sub;
        return session;
        
    }
  }
});

export { handler as GET, handler as POST };
