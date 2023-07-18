

export async function dateHyphenToDate(originalDate) {
    const temp = originalDate.split('/');
    return temp[2]+'-'+ temp[1]+'-'+temp[0]+'T00:00:00';
}