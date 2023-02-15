export function guaranteedString(s:string | undefined)
{
    if(s === undefined)
        return '(no string)';
    return s;
}