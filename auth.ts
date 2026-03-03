import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// If Google OAuth is needed later, import GoogleProvider
import dbConnect from "@/lib/dbConnect"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        await dbConnect()
        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) {
          return null
        }
        const isValid = await bcrypt.compare(credentials.password as string, user.password)
        if (!isValid) {
          return null
        }
        // Devuelve objeto usuario si credenciales conforman
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          balance: user.balance,
          isVerified: user.isVerified
        } as any
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.balance = (user as any).balance
        token.isVerified = (user as any).isVerified
      }
      // Para actualizar saldo luego de un juego
      if (trigger === "update" && session?.balance !== undefined) {
        token.balance = session.balance
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).balance = token.balance as number;
        (session.user as any).isVerified = token.isVerified as boolean;
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})
