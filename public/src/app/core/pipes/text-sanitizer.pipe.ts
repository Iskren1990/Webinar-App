import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textSanitizer'
})
export class TextSanitizerPipe implements PipeTransform {

  transform(text: string, element?: HTMLElement): string {
    const maxRowCharactersLength = ~~(Number(element.offsetWidth) / 8.5);

    const textAsArr = ((text, maxRowCharactersLength) => {
      if (text == null) return [];

      maxRowCharactersLength = ~~maxRowCharactersLength;

      return maxRowCharactersLength > 0
        ? text.match(new RegExp('.{1,' + maxRowCharactersLength + '}', 'g'))
        : [text];

    })(text, maxRowCharactersLength);

    const sanitizedStr = textAsArr
      .map((x, i) => {
        if (x.includes(" ") === false && i + 1 < textAsArr.length) x += " ";
        return x;
      })
      .join("");
      
    return sanitizedStr;
  }

}
