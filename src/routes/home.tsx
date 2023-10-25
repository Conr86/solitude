import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Page } from "prisma/prisma-client";
import { useQuery } from "@tanstack/react-query";
import { pageListQuery } from "@/helpers/api.ts";
import { Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import ErrorPage from "@/components/Error.tsx";
import { PageWithChildren } from "@/helpers/CustomTreeDataProvider.ts";

export default function Home() {
    const query = pageListQuery();
    const { data, isError, error } = useQuery<PageWithChildren[], Error>(
        query.queryKey,
        query.queryFn,
    );
    dayjs.extend(relativeTime);

    if (isError || !data) return <ErrorPage error={error?.message} />;

    return (
        <>
            <Helmet>
                <title>Solitude</title>
            </Helmet>
            <h1 className="font-bold text-gray-900 dark:text-white px-0 py-2 mb-8 text-3xl md:text-4xl rounded-md border-0 shadow-none outline-none focus:ring-0 bg-inherit">
                Jump back in...
            </h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Recently edited
                    </h5>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <tbody>
                                {data?.slice(0, 7).map((page: Page) => (
                                    <tr
                                        key={page.id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            <Link
                                                className="font-medium text-primary-700 no-underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-secondary-700 hover:underline"
                                                to={"/page/$pageId"}
                                                params={{
                                                    pageId: page.id.toString(),
                                                }}
                                            >
                                                {page.title}
                                            </Link>
                                        </th>
                                        <td className="px-6 py-4">
                                            {dayjs().from(
                                                dayjs(page.updatedAt),
                                                true,
                                            )}{" "}
                                            ago
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Stats</h5>
          <p className="my-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Pages <span className="text-xl">{data.length}</span></p>
          <hr/>
          <p className="my-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Pages <span className="text-xl">{pagesCount}</span></p>
          <hr/>
        </div>
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">TODO</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400"></p>
        </div> */}
            </div>
        </>
    );
}
