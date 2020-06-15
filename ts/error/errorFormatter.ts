export function errorFormatter(error: any, describe: string) : any {
    return {
        'ErrorName': error.name,
        'ErrorDirection':  describe,
        'ErrorMessage': error.message
    }
}