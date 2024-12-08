import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import MailController from '@/api/controllers/MailController'
import { useEffect } from 'react'

export const Route = createFileRoute('/_app/box/$mailbox')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const mailboxQuery = useQuery({
    queryKey: ['mailbox', params.mailbox],
    queryFn: () => MailController.fetchEmail(params.mailbox),
  })

  useEffect(() => {
    console.log(mailboxQuery.data)
  }, [mailboxQuery.data])
  return <div>Hello "/_app/box/{params.mailbox}"!</div>
}
