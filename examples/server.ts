import { fromFileUrl, join } from "https://deno.land/std@0.175.0/path/mod.ts";
import { codeToURI } from "../src/util.ts";

const bundle = async (root: string) => {
    const p = Deno.run({
        cmd: ["deno", "bundle", "-q", root],
        stdout: "piped",
    });

    return new TextDecoder().decode(await p.output());
};
const list =
    (await scanFolder("app", fromFileUrl(join(Deno.mainModule, ".."))))[1];
const serv = Deno.listen({
    port: 7000,
});
const {
    port,
    hostname,
} = serv.addr as Deno.NetAddr;

console.log(`Listening on ${hostname}:${port}/`);

for await (const req of serv) {
    serve(req);
}

async function scanFile(
    name: string,
    mainDir: string,
): Promise<[string, string]> {
    const path = join(mainDir, name);

    if (name.endsWith("tsx")) {
        const modCode = await bundle(path);
        const modURI = codeToURI(modCode, "javascript");
        const code = (
            await bundle(
                codeToURI(
                    `import App from "${modURI}";\n\n\tdocument.body.appendChild(App());`,
                ),
            )
        )
            .split("\n")
            .map((line) => `\t${line}`)
            .join("\n");

        return [
            name.split(".")[0],
            `<script type="module">\n${code}\n</script>`,
        ];
    }

    return [name, await Deno.readTextFile(path)];
}

async function scanFolder(
    name: string,
    mainDir: string,
): Promise<[string, List]> {
    const list: List = {};
    const dir = join(mainDir, name);

    for await (
        const {
            name,
        } of Deno.readDir(dir)
    ) {
        const path = join(dir, name);
        const stat = await Deno.stat(path);
        const [key, str] = stat.isDirectory
            ? await scanFolder(name, dir)
            : await scanFile(name, dir);

        list[key] = str;
    }

    return [name, list];
}

async function serve(req: Deno.Conn) {
    const http = Deno.serveHttp(req);

    for await (const req of http) {
        const names = new URL(req.request.url).pathname.split("/").filter((
            name,
        ) => name.length);
        let pathList = list;
        let code = "";

        for (const name of names) {
            const tmp = pathList[name];

            if (!tmp) break;
            if (typeof tmp == "string") code = tmp;
            else pathList = tmp;
        }

        req.respondWith(
            code
                ? new Response(code, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                })
                : new Response(null, {
                    status: 404,
                }),
        );
    }
}
